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
            }
        } catch (lotteryError) {
            console.error('Error fetching lottery stats:', lotteryError);
            // Continue without lottery stats
        }

        return {
            isAdmin: true,
            loggedIn: true,
            isHost: !!locals.user.host,
            lotteryStats
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