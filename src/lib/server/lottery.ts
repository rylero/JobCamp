import { prisma } from './prisma.js';

export async function startLotteryJob(adminId: string) {
    // Clear any existing lottery results (only keep latest)
    await prisma.lotteryResults.deleteMany({});
    
    // Create job record
    const job = await prisma.lotteryJob.create({
        data: {
            status: 'RUNNING',
            adminId,
            startedAt: new Date()
        }
    });

    // Run in background (don't await)
    runLotteryInBackground(job.id);
    
    return job.id;
}

async function runLotteryInBackground(jobId: string) {
    try {
        // Initial progress update
        await prisma.lotteryJob.update({
            where: { id: jobId },
            data: { 
                progress: 0,
                currentSeed: 0
            }
        });
        
        // Get all students and their preferences
        const students = await prisma.student.findMany({
            include: {
                positionsSignedUpFor: {
                    include: {
                        position: true
                    },
                    orderBy: { rank: 'asc' }
                }
            }
        });

        // Get all positions
        const positions = await prisma.position.findMany({
            include: {
                event: {
                    include: {
                        school: true
                    }
                }
            }
        });

        let bestResult = null;
        let bestCost = Infinity;

        // Your lottery algorithm here
        for (let seed = 1; seed <= 5000; seed++) {
            // Run lottery with this seed
            const result = await runLotteryWithSeed(seed, students, positions);
            
            // Track the best result
            if (result.cost < bestCost) {
                bestCost = result.cost;
                bestResult = result.assignments;
            }
            
            // Update progress every 100 seeds (less frequent updates for speed)
            if (seed % 100 === 0) {
                const progress = (seed / 5000) * 100;
                
                await prisma.lotteryJob.update({
                    where: { id: jobId },
                    data: { 
                        progress,
                        currentSeed: seed
                    }
                });
                
                // Minimal delay for speed
                await new Promise(resolve => setTimeout(resolve, 10));
            }
        }
        
        // Save only the best result to database
        if (bestResult) {
            const resultsToSave = [];
            for (const [studentId, assignment] of Object.entries(bestResult)) {
                if (assignment.positionId) {
                    resultsToSave.push({
                        lotteryJobId: jobId,
                        studentId,
                        positionId: assignment.positionId
                    });
                }
            }

            if (resultsToSave.length > 0) {
                await prisma.lotteryResults.createMany({
                    data: resultsToSave,
                    skipDuplicates: true
                });
            }
        }
        
        // Mark as complete
        await prisma.lotteryJob.update({
            where: { id: jobId },
            data: { 
                status: 'COMPLETED',
                completedAt: new Date()
            }
        });
        
    } catch (error) {
        await prisma.lotteryJob.update({
            where: { id: jobId },
            data: { 
                status: 'FAILED',
                error: error instanceof Error ? error.message : String(error)
            }
        });
    }
}

async function runLotteryWithSeed(seed: number, students: any[], positions: any[]) {
    // Your migrated lottery algorithm
    function deepCopy(obj: any) {
        return JSON.parse(JSON.stringify(obj));
    }
    
    function shuffle(array: any[]) {
        // Fisher-Yates shuffle with seed
        let m = array.length, t, i;
        while (m) {
            i = Math.floor(Math.random() * m--);
            t = array[m];
            array[m] = array[i];
            array[i] = t;
        }
        return array;
    }

    let cost = 0;
    let worstrank = 0;
    const studentsCopy = deepCopy(students);
    shuffle(studentsCopy);
    
    const positionSlots: { [key: string]: number } = {};
    positions.forEach(pos => {
        positionSlots[pos.id] = pos.slots;
    });
    
    const assignments: { [key: string]: { positionId: string | null, rank: number | null } } = {};
    studentsCopy.forEach((s: any) => {
        assignments[s.id] = { positionId: null, rank: null };
    });

    // Convert student preferences to the format your algorithm expects
    for (let currentRank = 0; currentRank < 10; currentRank++) {
        for (const student of studentsCopy) {
            if (assignments[student.id].positionId !== null) continue;
            
            // Convert positionsSignedUpFor to preferences format
            const sortedPrefs = student.positionsSignedUpFor
                .map((pref: any) => ({ positionId: pref.positionId, rank: pref.rank }))
                .sort((a: any, b: any) => a.rank - b.rank);
            
            for (const pref of sortedPrefs) {
                if (pref.rank !== currentRank) continue;
                const positionId = pref.positionId;
                if (positionSlots[positionId] > 0) {
                    assignments[student.id] = { positionId, rank: pref.rank };
                    positionSlots[positionId] -= 1;
                    cost += pref.rank;
                    if (pref.rank > worstrank) worstrank = pref.rank;
                    break;
                }
            }
        }
    }

    return { assignments, cost };
} 