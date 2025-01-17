import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { lucia } from "$lib/server/auth";
import type { PageServerLoad } from "./$types";
import { prisma } from "$lib/server/prisma";
import { getFileUrl } from "./storage";

const grabUserData: any = async (locals : App.Locals) => {
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

    if (!hostInfo) {
        return { positions: [], userData: event.locals.user, isCompany: false };
    }


    var positions = await prisma.position.findMany({where: {hostId: hostInfo.id}, include: { attachments: true }});

    positions = await Promise.all(positions.map(async (element: any) => {
        if (element.attachments[0]) {
            element.attachment1 = { 
                name: element.attachments[0],
                link: (await getFileUrl(element.attachments[0]))()
            };
        }
        if (element.attachments[1]) {
            element.attachment2 = {
                name: element.attachments[1],
                link: (await getFileUrl(element.attachments[1]))()
            };
        }
        return element
    }));

    return { positions, userData: event.locals.user, isCompany: true };
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