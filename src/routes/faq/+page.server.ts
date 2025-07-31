import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';

export const load : PageServerLoad = async ({ locals }) => {
    const loggedIn = locals.user != null;
    
    let isHost = false;
    let isAdmin = false;
    if (locals.user) {
        isHost = locals.user.host != null;
        // Check if user is admin by looking for adminOfSchools
        if (locals.user.id) {
            const userInfo = await prisma.user.findFirst({
                where: { id: locals.user.id },
                include: { adminOfSchools: true }
            });
            isAdmin = (userInfo?.adminOfSchools?.length || 0) > 0;
        }
    }

    return { isHost, loggedIn, isAdmin };
};