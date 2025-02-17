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
    update: async({ request, locals, cookies }) => {
        const data = await request.formData();

        let posIdsString = data.get("posIds")?.toString();
        if (!posIdsString) {
            redirect(302, "/about");
        }
        let posIds = JSON.parse(posIdsString).positions;
        if (!posIds) {
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

        let positions = posIds.map((val: string, i: number) => {
            return {
                rank: i,
                studentId: student.id,
                positionId: val,
            };
        })

        await prisma.$transaction([
            prisma.positionsOnStudents.deleteMany({
                where: { studentId: studentId }
            }),
            prisma.positionsOnStudents.createMany({
                data: positions
            })
        ]);
    },
}