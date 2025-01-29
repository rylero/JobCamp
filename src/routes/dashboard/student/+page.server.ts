import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
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

    console.log(positions);

    return { positions: positions };
};