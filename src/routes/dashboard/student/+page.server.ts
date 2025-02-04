import { redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { prisma } from "$lib/server/prisma";

export const load: PageServerLoad = async (event) => {
    if (!event.locals.user) {
        redirect(302, "/login");
    }
    if (!event.locals.user.emailVerified) {
        redirect(302, "/verify-email");
    }

    const student = await prisma.student.findFirst({ where: {
        userId: event.locals.user.id
    }});
    
    if (!student) {
        redirect(302, "/dashboard");
    }

    let positionsOnStudents = await prisma.positionsOnStudents.findMany({
        where: {studentId: student.id},
        orderBy: { rank: "asc" },
        include: { position: {
            include: {
                host: {
                    include: {
                        company: true
                    }
                }
            }
        } }
    });

    let positions = positionsOnStudents.map(val => val.position);

    return { positions: positions };
};


export const actions: Actions = {
    deletePosition: async({ request, locals, cookies }) => {
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

        let positionsOnStudents = await prisma.positionsOnStudents.findMany({
            where: {studentId: student.id},
            orderBy: { rank: "asc" },
            include: { position: {
                include: {
                    host: {
                        include: {
                            company: true
                        }
                    }
                }
            } }
        });

        await prisma.positionsOnStudents.deleteMany({
            where: { studentId: studentId}
        })

        let newPositionsOnStudents = positionsOnStudents.filter(val => val.positionId != posId);

        let positions = newPositionsOnStudents.map((val, i) => {
            return { 
                rank: i,
                studentId: val.studentId,
                positionId: val.positionId,
            };
        })

        await prisma.positionsOnStudents.createMany({
            data: positions
        });
    },
    move: async({request, locals, cookies}) => {
        const data = await request.formData();

        const posId = data.get("id")?.toString();
        if (!posId) {
            redirect(302, "/about");
        }

        const direction = data.get("dir")?.toString();
        if (!direction) {
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

        let positionsOnStudents = await prisma.positionsOnStudents.findMany({
            where: {studentId: student.id},
            orderBy: { rank: "asc" },
            include: { position: {
                include: {
                    host: {
                        include: {
                            company: true
                        }
                    }
                }
            } }
        });

        await prisma.positionsOnStudents.deleteMany({
            where: { studentId: studentId}
        })

        let posRankIndex = 0;
        for (let i = 0; i < positionsOnStudents.length; i++) {
            if (positionsOnStudents[i].positionId == posId) {
                posRankIndex = i;
            }
        }

        var dir = direction == "down" ? -1 : 1;
        var temp = positionsOnStudents[posRankIndex - dir];
        positionsOnStudents[posRankIndex - dir] = positionsOnStudents[posRankIndex];
        positionsOnStudents[posRankIndex] = temp;

        let positions = positionsOnStudents.map((val, i) => {
            return { 
                rank: i, 
                studentId: val.studentId,
                positionId: val.positionId,
            };
        })

        await prisma.positionsOnStudents.createMany({
            data: positions
        });
    }
}