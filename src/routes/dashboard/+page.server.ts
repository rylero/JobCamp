import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { lucia } from "$lib/server/auth";

import { PageType, userAccountSetupFlow } from '$lib/server/authFlow';
import type { PageServerLoad } from "./$types";
import { prisma } from "$lib/server/prisma";

export const load: PageServerLoad = async (event) => {
    userAccountSetupFlow(event.locals, PageType.RequiresAuth);

    if (!event.locals.user) {
        redirect(302, "/login");
    }

    const hostAndPositionInfo = await prisma.host.findFirst({
        where: { userId: event.locals.user?.id },
        include: {
            positions: true
        }
    });

    return { userData: event.locals.user, hostAndPositionInfo };
};

export const actions: Actions = {
    default: async ({ locals, cookies }) => {
        if (locals.session) {
            const session = await lucia.validateSession(locals.session.id);
            if (!session) return fail(401);
            await lucia.invalidateSession(locals.session.id);
            cookies.delete(lucia.sessionCookieName, { path: "." });
        }
        redirect(302, "/login")
    }
};