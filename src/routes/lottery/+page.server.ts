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

    const schoolIds = userInfo.adminOfSchools.map(s => s.id);

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

    // Get lottery configuration for the first school (assuming single school admin for now)
    const schoolId = schoolIds[0];
    let lotteryConfig = await prisma.lotteryConfiguration.findUnique({
        where: { schoolId },
        include: {
            manualAssignments: {
                include: {
                    student: true,
                    position: {
                        include: {
                            host: {
                                include: {
                                    company: true
                                }
                            }
                        }
                    }
                }
            },
            prefillSettings: {
                include: {
                    company: true
                }
            }
        }
    });

    // If no config exists, create one
    if (!lotteryConfig) {
        lotteryConfig = await prisma.lotteryConfiguration.create({
            data: {
                schoolId,
                gradeOrder: 'NONE' // Default to random order
            },
            include: {
                manualAssignments: {
                    include: {
                        position: {
                            include: {
                                host: {
                                    include: {
                                        company: true
                                    }
                                }
                            }
                        }
                    }
                },
                prefillSettings: {
                    include: {
                        company: true
                    }
                }
            }
        });
    }

    // Get all students for manual assignment dropdown
    const students = await prisma.student.findMany({
        where: { schoolId },
        orderBy: { lastName: 'asc' },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            grade: true
        }
    });

    // Get all positions for manual assignment dropdown
    const positions = await prisma.position.findMany({
        where: {
            event: { schoolId }
        },
        include: {
            host: {
                include: {
                    company: true
                }
            }
        },
        orderBy: [
            { host: { company: { companyName: 'asc' } } },
            { title: 'asc' }
        ]
    });

    // Get all companies for prefill settings
    const companies = await prisma.company.findMany({
        where: { schoolId },
        orderBy: { companyName: 'asc' }
    });

    return {
        isAdmin: true,
        loggedIn: true,
        isHost: !!locals.user.host,
        lotteryData: {
            isRunning: !!runningLottery,
            progress: runningLottery?.progress || 0,
            currentSeed: runningLottery?.currentSeed || 0,
            stats: lotteryStats
        },
        lotteryConfig,
        students,
        positions,
        companies
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
}

export const actions: Actions = {
    runLottery: async ({ locals, request }) => {
        if (!locals.user) {
            return { 
                success: false, 
                message: "User not authenticated" 
            };
        }

        try {
            const formData = await request.formData();
            const gradeOrder = formData.get('gradeOrder') as string;

            // Get user's school
            const userInfo = await prisma.user.findFirst({
                where: { id: locals.user.id },
                include: { adminOfSchools: true }
            });

            if (!userInfo?.adminOfSchools?.length) {
                return { success: false, message: "Not authorized" };
            }

            const schoolId = userInfo.adminOfSchools[0].id;

            // Update lottery configuration with current grade order
            if (gradeOrder && ['NONE', 'ASCENDING', 'DESCENDING'].includes(gradeOrder)) {
                await prisma.lotteryConfiguration.upsert({
                    where: { schoolId },
                    update: { gradeOrder },
                    create: { schoolId, gradeOrder }
                });
            }
            
            // Start background job
            const jobId = await startLotteryJob(locals.user.id);
            
            return { 
                success: true, 
                jobId,
                message: "Lottery started. You'll be notified when complete." 
            };
        } catch {
            return { 
                success: false, 
                message: "Failed to start lottery" 
            };
        }
    },

    addManualAssignment: async ({ locals, request }) => {
        if (!locals.user) {
            return { success: false, message: "User not authenticated" };
        }

        const formData = await request.formData();
        const studentId = formData.get('studentId') as string;
        const positionId = formData.get('positionId') as string;

        if (!studentId || !positionId) {
            return { success: false, message: "Student and position are required" };
        }

        try {
            // Get user's school
            const userInfo = await prisma.user.findFirst({
                where: { id: locals.user.id },
                include: { adminOfSchools: true }
            });

            if (!userInfo?.adminOfSchools?.length) {
                return { success: false, message: "Not authorized" };
            }

            const schoolId = userInfo.adminOfSchools[0].id;

            // Get or create lottery configuration
            let config = await prisma.lotteryConfiguration.findUnique({
                where: { schoolId }
            });

            if (!config) {
                config = await prisma.lotteryConfiguration.create({
                    data: { schoolId, gradeOrder: 'NONE' }
                });
            }

            // Add manual assignment
            await prisma.manualAssignment.upsert({
                where: {
                    studentId_lotteryConfigId: {
                        studentId,
                        lotteryConfigId: config.id
                    }
                },
                update: {
                    positionId
                },
                create: {
                    lotteryConfigId: config.id,
                    studentId,
                    positionId
                }
            });

            return { success: true, message: "Manual assignment added" };
        } catch {
            return { success: false, message: "Failed to add manual assignment" };
        }
    },

    removeManualAssignment: async ({ locals, request }) => {
        if (!locals.user) {
            return { success: false, message: "User not authenticated" };
        }

        const formData = await request.formData();
        const studentId = formData.get('studentId') as string;

        if (!studentId) {
            return { success: false, message: "Student ID is required" };
        }

        try {
            // Get user's school
            const userInfo = await prisma.user.findFirst({
                where: { id: locals.user.id },
                include: { adminOfSchools: true }
            });

            if (!userInfo?.adminOfSchools?.length) {
                return { success: false, message: "Not authorized" };
            }

            const schoolId = userInfo.adminOfSchools[0].id;

            // Get lottery configuration
            const config = await prisma.lotteryConfiguration.findUnique({
                where: { schoolId }
            });

            if (!config) {
                return { success: false, message: "No lottery configuration found" };
            }

            // Remove manual assignment
            await prisma.manualAssignment.deleteMany({
                where: {
                    lotteryConfigId: config.id,
                    studentId
                }
            });

            return { success: true, message: "Manual assignment removed" };
        } catch {
            return { success: false, message: "Failed to remove manual assignment" };
        }
    },

    updatePrefillSetting: async ({ locals, request }) => {
        if (!locals.user) {
            return { success: false, message: "User not authenticated" };
        }

        const formData = await request.formData();
        const companyId = formData.get('companyId') as string;
        const prefillPercentage = parseInt(formData.get('prefillPercentage') as string);

        if (!companyId || isNaN(prefillPercentage) || prefillPercentage < 0 || prefillPercentage > 100) {
            return { success: false, message: "Valid company and percentage (0-100) are required" };
        }

        try {
            // Get user's school
            const userInfo = await prisma.user.findFirst({
                where: { id: locals.user.id },
                include: { adminOfSchools: true }
            });

            if (!userInfo?.adminOfSchools?.length) {
                return { success: false, message: "Not authorized" };
            }

            const schoolId = userInfo.adminOfSchools[0].id;

            // Get or create lottery configuration
            let config = await prisma.lotteryConfiguration.findUnique({
                where: { schoolId }
            });

            if (!config) {
                config = await prisma.lotteryConfiguration.create({
                    data: { schoolId, gradeOrder: 'NONE' }
                });
            }

            // Update prefill setting
            await prisma.prefillSetting.upsert({
                where: {
                    companyId_lotteryConfigId: {
                        companyId,
                        lotteryConfigId: config.id
                    }
                },
                update: {
                    prefillPercentage
                },
                create: {
                    lotteryConfigId: config.id,
                    companyId,
                    prefillPercentage
                }
            });

            return { success: true, message: "Prefill setting updated" };
        } catch {
            return { success: false, message: "Failed to update prefill setting" };
        }
    },

    removePrefillSetting: async ({ locals, request }) => {
        if (!locals.user) {
            return { success: false, message: "User not authenticated" };
        }

        const formData = await request.formData();
        const companyId = formData.get('companyId') as string;

        if (!companyId) {
            return { success: false, message: "Company ID is required" };
        }

        try {
            // Get user's school
            const userInfo = await prisma.user.findFirst({
                where: { id: locals.user.id },
                include: { adminOfSchools: true }
            });

            if (!userInfo?.adminOfSchools?.length) {
                return { success: false, message: "Not authorized" };
            }

            const schoolId = userInfo.adminOfSchools[0].id;

            // Get lottery configuration
            const config = await prisma.lotteryConfiguration.findUnique({
                where: { schoolId }
            });

            if (!config) {
                return { success: false, message: "No lottery configuration found" };
            }

            // Remove prefill setting
            await prisma.prefillSetting.deleteMany({
                where: {
                    lotteryConfigId: config.id,
                    companyId
                }
            });

            return { success: true, message: "Prefill setting removed" };
        } catch {
            return { success: false, message: "Failed to remove prefill setting" };
        }
    },


};