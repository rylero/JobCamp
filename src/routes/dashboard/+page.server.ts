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
        const { userInfo, hostInfo } = await grabUserData(locals);
        const form = await superValidate(request, zod(createNewPositionSchema(hostInfo.name, userInfo.email)));

        if (!form.valid) {
            console.log("fail")
            return fail(400, { form, positionCreateOpen: true });
        }

        if (!locals.user) {
            redirect(302, "login");
        }

        const host = await prisma.host.findFirst({
            where: { userId: locals.user.id }, 
            include: { company: { include: { school: true } } }
        })

        const schoolId = host?.company?.schoolId;
        if (!schoolId) {
            redirect(302, "/login");
        }

        const eventId = (await prisma.school.findFirst({where: {id: schoolId}, include: {events: true}}))?.events[0].id;   
        if (!eventId) {
            redirect(302, "/login")
        }

        await prisma.host.update({
            where: { userId: locals.user.id },
            data: {
                positions: {
                    create: [
                        {
                            title: form.data.title,
                            career: form.data.career,
                            slots: form.data.slots,
                            summary: form.data.summary,
                            contact_name: form.data.fullName,
                            contact_email: form.data.email,
                            address: form.data.address,
                            instructions: form.data.instructions,
                            attire: form.data.attire,
                            arrival: form.data.arrival,
                            start: form.data.start,
                            end: form.data.relesase,
                            event: { connect: { id: eventId } }
                        }
                    ]
                }
            }
        })

        return { form, positionCreateOpen: false }
    }
};