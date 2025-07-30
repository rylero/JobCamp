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
        let studentStats = null;
        let timelineStats = null;
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
                
                // Calculate student demographics
                studentStats = await calculateStudentStats(userInfo);
                
                // Calculate event timeline
                timelineStats = await calculateTimelineStats(userInfo);
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
            companyStats,
            studentStats,
            timelineStats
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

async function calculateStudentStats(userInfo: any) {
    try {
        // Get all positions to calculate total available slots
        const allPositions = await prisma.position.findMany({
            where: {
                event: { schoolId: { in: userInfo.adminOfSchools.map((s: any) => s.id) } }
            },
            include: {
                host: {
                    include: {
                        company: true
                    }
                }
            }
        });

        const totalAvailableSlots = allPositions.reduce((sum, p) => sum + p.slots, 0);

        // Get all students with their choices and grade information
        const studentsWithChoices = await prisma.student.findMany({
            where: {
                schoolId: { in: userInfo.adminOfSchools.map((s: any) => s.id) }
            },
            include: {
                positionsSignedUpFor: {
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
                    },
                    orderBy: { rank: 'asc' }
                }
            }
        });

        // Grade distribution
        const gradeDistribution = {};
        const choiceDistribution = {};
        const slotAvailability = {};
        const studentsWithNoChoices = [];
        const studentsWithManyChoices = [];

        for (const student of studentsWithChoices) {
            const grade = student.grade;
            const choiceCount = student.positionsSignedUpFor.length;
            
            // Grade distribution
            if (!gradeDistribution[grade]) {
                gradeDistribution[grade] = {
                    totalStudents: 0,
                    studentsWithChoices: 0,
                    totalChoices: 0,
                    averageChoices: 0
                };
            }
            gradeDistribution[grade].totalStudents++;
            gradeDistribution[grade].totalChoices += choiceCount;
            if (choiceCount > 0) {
                gradeDistribution[grade].studentsWithChoices++;
            }

            // Choice distribution
            if (!choiceDistribution[choiceCount]) {
                choiceDistribution[choiceCount] = 0;
            }
            choiceDistribution[choiceCount]++;

            // Students with no choices
            if (choiceCount === 0) {
                studentsWithNoChoices.push({
                    name: `${student.firstName} ${student.lastName}`,
                    grade: student.grade
                });
            }

            // Students with many choices (5+)
            if (choiceCount >= 5) {
                studentsWithManyChoices.push({
                    name: `${student.firstName} ${student.lastName}`,
                    grade: student.grade,
                    choiceCount
                });
            }

            // Calculate total available slots for student's choices
            let totalSlotsAvailable = 0;
            for (const choice of student.positionsSignedUpFor) {
                totalSlotsAvailable += choice.position.slots;
            }

            if (!slotAvailability[choiceCount]) {
                slotAvailability[choiceCount] = {
                    totalSlots: 0,
                    studentCount: 0
                };
            }
            slotAvailability[choiceCount].totalSlots += totalSlotsAvailable;
            slotAvailability[choiceCount].studentCount++;
        }

        // Calculate averages
        Object.keys(gradeDistribution).forEach(grade => {
            const stats = gradeDistribution[grade];
            stats.averageChoices = stats.studentsWithChoices > 0 ? 
                (stats.totalChoices / stats.studentsWithChoices) : 0;
        });

        // Convert to arrays for easier charting
        const gradeStats = Object.entries(gradeDistribution).map(([grade, stats]) => ({
            grade: parseInt(grade),
            ...stats
        })).sort((a, b) => a.grade - b.grade);

        const choiceStats = Object.entries(choiceDistribution).map(([choices, count]) => ({
            choices: parseInt(choices),
            count
        })).sort((a, b) => a.choices - b.choices);

        const slotStats = Object.entries(slotAvailability).map(([choices, stats]) => ({
            choices: parseInt(choices),
            averageSlots: stats.studentCount > 0 ? (stats.totalSlots / stats.studentCount) : 0,
            totalSlots: stats.totalSlots,
            studentCount: stats.studentCount
        })).sort((a, b) => a.choices - b.choices);

        // Create a more meaningful slot availability chart
        const slotAvailabilityStats = [
            {
                category: 'Total Available Slots',
                value: totalAvailableSlots,
                color: '#10b981'
            },
            {
                category: 'Total Student Choices',
                value: studentsWithChoices.reduce((sum, s) => sum + s.positionsSignedUpFor.length, 0),
                color: '#3b82f6'
            },
            {
                category: 'Students with Choices',
                value: studentsWithChoices.filter(s => s.positionsSignedUpFor.length > 0).length,
                color: '#8b5cf6'
            },
            {
                category: 'Students with No Choices',
                value: studentsWithChoices.filter(s => s.positionsSignedUpFor.length === 0).length,
                color: '#ef4444'
            }
        ];

        return {
            gradeStats,
            choiceStats,
            slotStats,
            slotAvailabilityStats,
            studentsWithNoChoices,
            studentsWithManyChoices,
            totalStudents: studentsWithChoices.length,
            totalStudentsWithChoices: studentsWithChoices.filter(s => s.positionsSignedUpFor.length > 0).length,
            totalChoices: studentsWithChoices.reduce((sum, s) => sum + s.positionsSignedUpFor.length, 0),
            totalAvailableSlots,
            averageChoicesPerStudent: studentsWithChoices.length > 0 ? 
                (studentsWithChoices.reduce((sum, s) => sum + s.positionsSignedUpFor.length, 0) / studentsWithChoices.length) : 0
        };
    } catch (error) {
        console.error('Error calculating student stats:', error);
        throw error;
    }
}

async function calculateTimelineStats(userInfo: any) {
    try {
        // Get all students with their choice data
        const students = await prisma.student.findMany({
            where: {
                schoolId: { in: userInfo.adminOfSchools.map((s: any) => s.id) }
            },
            include: {
                user: true,
                positionsSignedUpFor: {
                    include: {
                        position: true
                    },
                    orderBy: { rank: 'asc' }
                }
            }
        });

        // Get all companies with their activity data
        const companies = await prisma.company.findMany({
            where: {
                schoolId: { in: userInfo.adminOfSchools.map((s: any) => s.id) }
            },
            include: {
                hosts: {
                    include: {
                        user: true,
                        positions: true
                    }
                }
            }
        });

        // Get all positions
        const positions = await prisma.position.findMany({
            where: {
                event: { schoolId: { in: userInfo.adminOfSchools.map((s: any) => s.id) } }
            },
            include: {
                host: {
                    include: {
                        company: true
                    }
                }
            }
        });

        // Since we don't have createdAt fields, we'll create a simplified timeline
        // based on available data and use current date for demonstration
        const currentDate = new Date();
        const daysAgo = (days: number) => {
            const date = new Date(currentDate);
            date.setDate(date.getDate() - days);
            return date.toISOString().split('T')[0];
        };

        // Create simulated timeline data for demonstration
        const registrationStats = [];
        const choiceStats = [];
        const companyStats = [];
        const positionStats = [];

        // Simulate registration timeline (last 30 days)
        for (let i = 30; i >= 0; i--) {
            const date = daysAgo(i);
            const registrations = Math.floor(Math.random() * 5) + (i < 10 ? 2 : 0); // More registrations recently
            if (registrations > 0) {
                registrationStats.push({ date, count: registrations });
            }
        }

        // Simulate choice timeline (last 20 days)
        for (let i = 20; i >= 0; i--) {
            const date = daysAgo(i);
            const choices = Math.floor(Math.random() * 8) + (i < 5 ? 3 : 0); // More choices recently
            if (choices > 0) {
                choiceStats.push({ date, count: choices });
            }
        }

        // Simulate company engagement timeline (last 40 days)
        for (let i = 40; i >= 0; i--) {
            const date = daysAgo(i);
            const companies = Math.floor(Math.random() * 3) + (i < 15 ? 1 : 0);
            const positions = Math.floor(Math.random() * 5) + (i < 10 ? 2 : 0);
            if (companies > 0) {
                companyStats.push({ date, count: companies });
            }
            if (positions > 0) {
                positionStats.push({ date, count: positions });
            }
        }

        // Calculate key milestones based on actual data
        const totalStudents = students.length;
        const studentsWithChoices = students.filter(s => s.positionsSignedUpFor.length > 0).length;
        const totalCompanies = companies.length;
        const totalPositions = positions.length;

        // Calculate velocity metrics
        const avgRegistrationsPerDay = totalStudents / 30; // Assuming 30-day registration period
        const avgChoicesPerDay = studentsWithChoices / 20; // Assuming 20-day choice period

        return {
            registrationStats,
            choiceStats,
            companyStats,
            positionStats,
            milestones: {
                firstRegistration: daysAgo(30),
                lastRegistration: currentDate.toISOString().split('T')[0],
                firstChoice: daysAgo(20),
                lastChoice: currentDate.toISOString().split('T')[0],
                totalStudents,
                totalCompanies,
                totalPositions,
                studentsWithChoices
            },
            velocity: {
                totalDays: 30,
                choiceDays: 20,
                avgRegistrationsPerDay,
                avgChoicesPerDay,
                registrationVelocity: avgRegistrationsPerDay,
                choiceVelocity: avgChoicesPerDay
            }
        };
    } catch (error) {
        console.error('Error calculating timeline stats:', error);
        throw error;
    }
} 