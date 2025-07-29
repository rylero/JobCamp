import type { PageServerLoad, Actions } from './$types';
import { redirect } from '@sveltejs/kit';
import { startLotteryJob } from '$lib/server/lottery';
import { prisma } from '$lib/server/prisma';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        redirect(302, "/login");
    }
    if (!locals.user.emailVerified) {
        redirect(302, "/verify-email");
    }

    // Check if user is admin
    const userInfo = await prisma.user.findFirst({
        where: { id: locals.user.id },
        include: { adminOfSchools: true }
    });

    if (!userInfo?.adminOfSchools?.length) {
        redirect(302, "/dashboard");
    }

    // Check if lottery is already running
    const runningLottery = await prisma.lotteryJob.findFirst({
        where: { status: 'RUNNING' }
    });

    // Get latest completed lottery results
    const latestJob = await prisma.lotteryJob.findFirst({
        where: { status: 'COMPLETED' },
        orderBy: { completedAt: 'desc' },
        include: { 
            results: true
        }
    });

    let lotteryStats = null;
    if (latestJob) {
        // Calculate choice statistics
        const stats = await calculateLotteryStats(latestJob.results);
        
        // Get admin email
        const admin = await prisma.user.findUnique({
            where: { id: latestJob.adminId },
            select: { email: true }
        });
        
        lotteryStats = {
            ...stats,
            completedAt: latestJob.completedAt,
            adminEmail: admin?.email || 'Unknown Admin'
        };
    }

    return {
        isAdmin: true,
        loggedIn: true,
        isHost: !!locals.user.host,
        lotteryData: {
            isRunning: !!runningLottery,
            progress: runningLottery?.progress || 0,
            currentSeed: runningLottery?.currentSeed || 0,
            stats: lotteryStats
        }
    };
};

async function calculateLotteryStats(results: { studentId: string; positionId: string }[]) {
    // Get all students who made choices
    const allStudentsWithChoices = await prisma.student.findMany({
        where: {
            positionsSignedUpFor: { some: {} }
        },
        select: { id: true }
    });
    
    const totalStudents = allStudentsWithChoices.length;
    const placedStudents = results.length;
    const notPlacedCount = totalStudents - placedStudents;
    
    console.log(`Debug: Total students with choices: ${totalStudents}`);
    console.log(`Debug: Placed students: ${placedStudents}`);
    console.log(`Debug: Not placed count: ${notPlacedCount}`);
    
    const choiceCounts = {
        firstChoice: 0,
        secondChoice: 0,
        thirdChoice: 0,
        fourthChoice: 0,
        fifthChoice: 0,
        sixthChoice: 0,
        seventhChoice: 0,
        eighthChoice: 0,
        ninthChoice: 0,
        tenthChoice: 0,
        notPlaced: notPlacedCount
    };

    for (const result of results) {
        // Get student's choices in order
        const studentChoices = await prisma.positionsOnStudents.findMany({
            where: { studentId: result.studentId },
            orderBy: { rank: 'asc' }
        });

        // Find which choice this position represents
        const choiceIndex = studentChoices.findIndex(choice => 
            choice.positionId === result.positionId
        );

        console.log(`Debug: Student ${result.studentId} placed in position ${result.positionId}, choice index: ${choiceIndex}`);

        if (choiceIndex === 0) choiceCounts.firstChoice++;
        else if (choiceIndex === 1) choiceCounts.secondChoice++;
        else if (choiceIndex === 2) choiceCounts.thirdChoice++;
        else if (choiceIndex === 3) choiceCounts.fourthChoice++;
        else if (choiceIndex === 4) choiceCounts.fifthChoice++;
        else if (choiceIndex === 5) choiceCounts.sixthChoice++;
        else if (choiceIndex === 6) choiceCounts.seventhChoice++;
        else if (choiceIndex === 7) choiceCounts.eighthChoice++;
        else if (choiceIndex === 8) choiceCounts.ninthChoice++;
        else if (choiceIndex === 9) choiceCounts.tenthChoice++;
        else {
            choiceCounts.notPlaced++; // Position not in student's choices
            console.log(`Debug: Student ${result.studentId} placed in position not in their choices`);
        }
    }

    console.log(`Debug: Final choice counts:`, choiceCounts);
    
    return {
        totalStudents,
        ...choiceCounts
    };
}

export const actions: Actions = {
    runLottery: async ({ locals }) => {
        if (!locals.user) {
            return { 
                success: false, 
                message: "User not authenticated" 
            };
        }
        
        // Start background job
        const jobId = await startLotteryJob(locals.user.id);
        
        return { 
            success: true, 
            jobId,
            message: "Lottery started. You'll be notified when complete." 
        };
    }
};