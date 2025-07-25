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

    const adminSchools = await prisma.school.findMany({
        where: { admins: { some: { id: event.locals.user.id } } }
    });
    
    if (adminSchools.length === 0) {
        redirect(302, "/dashboard");
    }
    
    // Return admin-specific data instead of student data
    return { adminSchools };

};


