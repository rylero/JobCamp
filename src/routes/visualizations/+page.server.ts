import { redirect } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';

export const load = async ({ locals }: { locals: any }) => {
    try {
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

        // Get latest completed lottery results
        let lotteryStats = null;
        let companyStats = null;
        try {
            const latestJob = await prisma.lotteryJob.findFirst({
                where: { status: 'COMPLETED' },
                orderBy: { completedAt: 'desc' },
                include: { 
                    results: true
                }
            });

            if (latestJob) {
                // Calculate choice statistics
                lotteryStats = await calculateLotteryStats(latestJob.results);
                
                // Calculate company analytics
                companyStats = await calculateCompanyStats(userInfo);
            }
        } catch (lotteryError) {
            console.error('Error fetching lottery stats:', lotteryError);
            // Continue without lottery stats
        }

        return {
            isAdmin: true,
            loggedIn: true,
            isHost: !!locals.user.host,
            lotteryStats,
            companyStats
        };
    } catch (error) {
        console.error('Error in visualizations load function:', error);
        throw error;
    }
};

async function calculateLotteryStats(results: { studentId: string; positionId: string }[]) {
    try {
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
                orderBy: { rank: 'asc' },
                select: { positionId: true }
            });

            // Find which choice this result represents
            const choiceIndex = studentChoices.findIndex(choice => 
                choice.positionId === result.positionId
            );

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
            else choiceCounts.notPlaced++; // Position not in student's choices
        }

        return {
            totalStudents,
            ...choiceCounts
        };
    } catch (error) {
        console.error('Error calculating lottery stats:', error);
        throw error;
    }
}

async function calculateCompanyStats(userInfo: any) {
    try {
        // Get all positions with their companies and student choices
        const positionsWithChoices = await prisma.position.findMany({
            where: {
                event: { schoolId: { in: userInfo.adminOfSchools.map((s: any) => s.id) } }
            },
            include: {
                host: {
                    include: {
                        company: true
                    }
                },
                students: {
                    include: {
                        student: true
                    }
                }
            }
        });

        // Group positions by career field
        const positionsByCareer: Record<string, any> = {};
        const companyPopularity: Record<string, any> = {};
        const oversubscribedCompanies: any[] = [];
        const undersubscribedCompanies: any[] = [];

        for (const position of positionsWithChoices) {
            const careerField = position.career || 'Other';
            const companyName = position.host.company?.companyName || 'Unknown Company';
            
            // Track positions by career
            if (!positionsByCareer[careerField]) {
                positionsByCareer[careerField] = {
                    totalPositions: 0,
                    totalSlots: 0,
                    totalChoices: 0,
                    companies: new Set()
                };
            }
            positionsByCareer[careerField].totalPositions++;
            positionsByCareer[careerField].totalSlots += position.slots;
            positionsByCareer[careerField].totalChoices += position.students.length;
            positionsByCareer[careerField].companies.add(companyName);

            // Track company popularity
            if (!companyPopularity[companyName]) {
                companyPopularity[companyName] = {
                    totalPositions: 0,
                    totalSlots: 0,
                    totalChoices: 0,
                    careerFields: new Set()
                };
            }
            companyPopularity[companyName].totalPositions++;
            companyPopularity[companyName].totalSlots += position.slots;
            companyPopularity[companyName].totalChoices += position.students.length;
            companyPopularity[companyName].careerFields.add(careerField);

            // Check for oversubscription
            const oversubscriptionRate = position.students.length / position.slots;
            if (oversubscriptionRate > 1) {
                oversubscribedCompanies.push({
                    company: companyName,
                    position: position.title,
                    slots: position.slots,
                    choices: position.students.length,
                    rate: oversubscriptionRate
                });
            } else if (position.students.length === 0) {
                undersubscribedCompanies.push({
                    company: companyName,
                    position: position.title,
                    slots: position.slots,
                    choices: 0
                });
            }
        }

        // Convert Sets to arrays for JSON serialization
        const careerStats = Object.entries(positionsByCareer).map(([career, stats]) => ({
            career,
            totalPositions: stats.totalPositions,
            totalSlots: stats.totalSlots,
            totalChoices: stats.totalChoices,
            averageChoicesPerPosition: stats.totalChoices / stats.totalPositions,
            companies: Array.from(stats.companies)
        }));

        const companyStats = Object.entries(companyPopularity).map(([company, stats]) => ({
            company,
            totalPositions: stats.totalPositions,
            totalSlots: stats.totalSlots,
            totalChoices: stats.totalChoices,
            averageChoicesPerPosition: stats.totalChoices / stats.totalPositions,
            careerFields: Array.from(stats.careerFields)
        }));

        // Sort by popularity
        careerStats.sort((a, b) => b.totalChoices - a.totalChoices);
        companyStats.sort((a, b) => b.totalChoices - a.totalChoices);
        oversubscribedCompanies.sort((a, b) => b.rate - a.rate);

        return {
            careerStats,
            companyStats,
            oversubscribedCompanies,
            undersubscribedCompanies,
            totalCompanies: Object.keys(companyPopularity).length,
            totalPositions: positionsWithChoices.length,
            totalSlots: positionsWithChoices.reduce((sum, p) => sum + p.slots, 0),
            totalChoices: positionsWithChoices.reduce((sum, p) => sum + p.students.length, 0)
        };
    } catch (error) {
        console.error('Error calculating company stats:', error);
        throw error;
    }
} 