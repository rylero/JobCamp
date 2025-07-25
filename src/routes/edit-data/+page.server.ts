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

    // Load data for editing
    //const schools = userInfo.adminOfSchools;
    //const users = await prisma.user.findMany({
    //    where: { 
    //        OR: [
    //            { student: { schoolId: { in: schools.map(s => s.id) } } },
    //            { host: { company: { schoolId: { in: schools.map(s => s.id) } } } }
    //        ]
    //    },
    //    include: { student: true, host: true }
    //});

    return {
        isAdmin: true,
        loggedIn: true,
        isHost: !!locals.user.host,
    };
};