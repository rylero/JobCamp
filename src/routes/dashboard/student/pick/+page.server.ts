import { prisma } from '$lib/server/prisma';
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
    const loggedIn = locals.user != null;
    
    let isHost = false;
    if (locals.user) {
        isHost = locals.user.host != null;
    }

    const schoolWebAddr = params.school;

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

    return { positionData, isHost, loggedIn };
}