import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";

import type { PageServerLoad } from "./$types";
import { prisma } from "$lib/server/prisma";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { editPositionSchema } from "./schema";
import { sendPositionUpdateEmail } from "$lib/server/email";

export const load: PageServerLoad = async (event) => {
    if (!event.locals.user) {
        redirect(302, "/login");
    }
    if (!event.locals.user.emailVerified) {
        redirect(302, "/verify-email");
    }

    const positionId = event.url.searchParams.get("posId")?.toString();
    if (!positionId) {
        redirect(302, "/lghs")
    }
    const positionInfo = await prisma.position.findFirst({ where: { id: positionId } })

    const form = await superValidate(zod(editPositionSchema(positionInfo)));
    
    return { form, posId: positionId };
};

export const actions: Actions = {
    createPosition: async ({ request, locals, cookies }) => {
        console.log("create position submit")

        const positionId = (await request.formData()).get("posId")?.toString();
        if (!positionId) {
            redirect(302, "/lghs")
        }
        const positionInfo = await prisma.position.findFirst({ where: { id: positionId } })
        
        const form = await superValidate(request, zod(editPositionSchema(positionInfo)));

        if (!form.valid) {
            console.log("fail")
            return fail(400, { form, posId: positionId });
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

        // sendPositionUpdateEmail(locals.user.email, {
        //     title: form.data.title,
        //     career: form.data.career,
        //     slots: form.data.slots,
        //     summary: form.data.summary,
        //     contact_name: form.data.fullName,
        //     contact_email: form.data.email,
        //     address: form.data.address,
        //     instructions: form.data.instructions,
        //     attire: form.data.attire,
        //     arrival: form.data.arrival,
        //     start: form.data.start,
        //     end: form.data.release,
        // });

        redirect(302, "/dashboard");
    }
};