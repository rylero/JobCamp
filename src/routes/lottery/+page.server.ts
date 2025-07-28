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

async function calculateLotteryStats(results: any[]) {
    const totalStudents = results.length;
    let firstChoice = 0;
    let secondChoice = 0;
    let thirdChoice = 0;
    let notPlaced = 0;

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

        if (choiceIndex === 0) firstChoice++;
        else if (choiceIndex === 1) secondChoice++;
        else if (choiceIndex === 2) thirdChoice++;
        else notPlaced++; // Position not in student's choices
    }

    return {
        totalStudents,
        firstChoice,
        secondChoice,
        thirdChoice,
        notPlaced
    };
}

export const actions: Actions = {
    runLottery: async ({ locals }) => {
        // Start background job
        const jobId = await startLotteryJob(locals.user.id);
        
        return { 
            success: true, 
            jobId,
            message: "Lottery started. You'll be notified when complete." 
        };
    }
};