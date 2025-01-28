import { prisma } from '$lib/server/prisma';
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { generatePermissionSlipCode } from '$lib/server/auth';
import { sendPermissionSlipEmail } from '$lib/server/email';

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
    sendPermissionSlip: async({ request, locals, cookies }) => {
        const data = await request.formData();
        console.log(data);
        
        const parentEmail = await data.get("parent-email");
        if (!parentEmail) {
            return { sent: false, err: true };
        }

        const id = locals.user?.id;
        if (!id) {
            redirect(302, "/login");
        }

        const user = await prisma.user.findFirst({ where: { id }, include: { student: true }})
        const firstName = user?.student?.firstName;
        if (!firstName) {
            redirect(302, "/login");
        }
        
        generatePermissionSlipCode(id, parentEmail.toString()).then(
            (code) => sendPermissionSlipEmail(parentEmail.toString(), code, firstName)
        );

        return { sent: true, err: false };
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

        return { sent: false, err: false };
    }
}