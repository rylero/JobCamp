import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { lucia } from "$lib/server/auth";

import { PageType, userAccountSetupFlow } from '$lib/server/authFlow';
import type { PageServerLoad } from "./$types";
import { prisma } from "$lib/server/prisma";
import { superValidate } from "sveltekit-superforms";
import { createNewPositionSchema } from "$lib/components/new_position/schema";
import { zod } from "sveltekit-superforms/adapters";

const grabUserData = async (locals : App.Locals) => {
    if (!locals.user) {
        redirect(302, "/login");
    }

    const userInfo = await prisma.user.findFirst({
        where: { id: locals.user.id }
    });
    if (!userInfo) {
        redirect(302, "/login")
    }
    
    const hostInfo = await prisma.host.findFirst({
        where: { userId: userInfo.id }
    });
    if (!hostInfo) {
        redirect(302, "/login")
    }

    return { userInfo, hostInfo }
}

export const load: PageServerLoad = async (event) => {
    userAccountSetupFlow(event.locals, PageType.RequiresAuth);

    const { userInfo, hostInfo } = await grabUserData(event.locals);
    const form = await superValidate(zod(createNewPositionSchema(hostInfo.name, userInfo.email)));

    return { userData: event.locals.user, form, positionCreateOpen: false };
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
    createPosition: async ({ request, locals, cookies }) => {
        console.log("test")
        const { userInfo, hostInfo } = await grabUserData(locals);
        const form = await superValidate(request, zod(createNewPositionSchema(hostInfo.name, userInfo.email)));

        if (!form.valid) {
            console.log("fail")
            return fail(400, { form, positionCreateOpen: true });
        }
        
        console.log(form.data.fullName)

        return { form, positionCreateOpen: false }
    }
};