import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

import type { PageServerLoad } from "./$types";
import { prisma } from "$lib/server/prisma";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { createNewPositionSchema } from "./schema";
import { sendPositionUpdateEmail } from "$lib/server/email";

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
    const form = await superValidate(zod(createNewPositionSchema(hostInfo.name, userInfo.email)));
    
    return { form };
};

export const actions: Actions = {
    createPosition: async ({ request, locals, cookies }) => {
        console.log("create position submit")
        const { userInfo, hostInfo } = await grabUserData(locals);
        const form = await superValidate(request, zod(createNewPositionSchema(hostInfo.name, userInfo.email)));

        if (!form.valid) {
            console.log("fail")
            return fail(400, { form });
        }

        if (!locals.user) {
            console.log("no user")
            redirect(302, "/login");
        }

        const host = await prisma.host.findFirst({
            where: { userId: locals.user.id }, 
            include: { company: { include: { school: true } } }
        })

        const schoolId = host?.company?.schoolId;
        if (!schoolId) {
            console.log("no school")
            redirect(302, "/login");
        }

        const event = (await prisma.school.findFirst({where: {id: schoolId}, include: {events: true}}))?.events[0];   
        if (!event) {
            console.log("no event")
            redirect(302, "/login")
        }

        const position = await prisma.host.update({
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
                            arrival: new Date(event.date.toLocaleDateString() + " " + form.data.arrival),
                            start: new Date(event.date.toLocaleDateString() + " " + form.data.start),
                            end: new Date(event.date.toLocaleDateString() + " " + form.data.release),
                            event: { connect: { id: event.id } }
                        }
                    ]
                }
            },
            include: { positions: true }
        })

        sendPositionUpdateEmail(userInfo.email, {
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
            end: form.data.release,
        });

        redirect(302, "/dashboard");
    }
};