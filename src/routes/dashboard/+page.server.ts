import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { lucia } from "$lib/server/auth";
import type { PageServerLoad } from "./$types";
import { prisma } from "$lib/server/prisma";

const grabUserData = async (locals : App.Locals) => {
    if (!locals.user) {
        redirect(302, "/login");
    }

    const userInfo = await prisma.user.findFirst({
        where: { id: locals.user.id }
    });
    if (!userInfo) {
        redirect(302, "/lghs")
    }
    
    const hostInfo = await prisma.host.findFirst({
        where: { userId: userInfo.id }
    });
    if (!hostInfo) {
        redirect(302, "/lghs")
    }

    return { userInfo, hostInfo }
}

export const load: PageServerLoad = async (event) => {
    if (!event.locals.user) {
        redirect(302, "/login");
    }
    if (!event.locals.user.emailVerified) {
        redirect(302, "/verify-email");
    }

    const { userInfo, hostInfo } = await grabUserData(event.locals);
    const positions = await prisma.position.findMany({where: {hostId: hostInfo.id}});

    return { positions, userData: event.locals.user };
};

export const actions: Actions = {
    logOut: async ({ locals, cookies }) => {
        if (locals.session) {
            const session = await lucia.validateSession(locals.session.id);
            if (!session) return fail(401);
            await lucia.invalidateSession(locals.session.id);
            cookies.delete(lucia.sessionCookieName, { path: "." });
        }
        redirect(302, "/login")
    },
    deletePosition: async ({ locals, cookies, url }) => {
        const positionId = url.searchParams.get("posId")?.toString();
        if (!positionId) {
            redirect(302, "/about")
        }

        await prisma.position.delete({ where: { id: positionId }});
    }
};