import { prisma } from '$lib/server/prisma';
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
    if (!locals.user) {
        redirect(302, "/login");
    }

    const schoolWebAddr = "lghs";

    const school = await prisma.school.findFirst({ where: { webAddr: schoolWebAddr } });

    if (!school) {
        redirect(302, "/");
    }

    const positionData = await prisma.position.findMany({
        where: {
            host: {
                company: {
                    school: {
                        id: school.id
                    }
                }
            }
        },
        include: {
            host: {
                select: {
                    company: true
                }
            }
        }
    });

    const student = await prisma.student.findFirst({where: {userId: locals.user.id}});
    const studentId = student?.id;
    if (!studentId) {
        redirect(302, "/login");
    }

    const positionsOnStudents = await prisma.positionsOnStudents.findMany({ where: {
        studentId: studentId
    }})

    positionData.map((val: any) => {
        val.selected = false;
        positionsOnStudents.forEach(a => {
            if (a.positionId == val.id) {
                val.selected = true;
            }
        })
        return val;
    })

    const posData: any = positionData;

    return { positionData: posData, countSelected: positionsOnStudents.length, permissionSlipCompleted: student.permissionSlipCompleted, parentEmail: student.parentEmail };
}


export const actions: Actions = {
    sendPermissionSlip: async(event) => {
        // TODO: Implement
    },
    togglePosition: async ({ request, locals, cookies }) => {
        const data = await request.formData();

        const posId = data.get("id")?.toString();
        if (!posId) {
            redirect(302, "/about");
        }

        const id = locals.user?.id;
        if (!id) {
            redirect(302, "/login");
        }

        const student = await prisma.student.findFirst({where: {userId: id}});
        const studentId = student?.id;
        if (!studentId) {
            redirect(302, "/login");
        }

        const positionOnStudent = await prisma.positionsOnStudents.deleteMany({
            where: { studentId: studentId, positionId: posId}
        })

        if (positionOnStudent.count == 0) { // no record exsited, we should add one as this means the checkbox was just checked
            const highestRank = await prisma.positionsOnStudents.findFirst({
                where: { studentId: studentId },
                orderBy: {
                    rank: "desc"
                },
            });

            let max = 0;
            if (highestRank) {
                max = highestRank.rank+1;
            }


            const res = await prisma.positionsOnStudents.create({
                data: {
                    student: {
                        connect: {
                            id: studentId,
                        }
                    },
                    position: {
                        connect: {
                            id: posId,
                        }
                    },
                    rank: max
                }
            });
        }
    }
}