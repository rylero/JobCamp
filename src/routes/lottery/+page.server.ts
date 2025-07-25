import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
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

    // Load lottery-specific data
    //const lotteryResults = await prisma.student.findMany({
    //    where: { 
    //        schoolId: { in: userInfo.adminOfSchools.map(s => s.id) },
    //        lotteryPositionId: { not: null }
    //    },
    //    include: { 
    //        lotteryResult: { include: { host: { include: { company: true } } } }
    //    }
    //});

    return {
        isAdmin: true,
        loggedIn: true,
        isHost: !!locals.user.host,
    };
};