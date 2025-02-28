import { sendEmailLotteryEmail } from '$lib/server/email';
import { prisma } from '$lib/server/prisma';
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load : PageServerLoad = async ({ cookies, params, locals }) => {
    if (!locals.user) {
        redirect(302, "/login");
    }

    return { positions: await prisma.position.findMany({include: { host: { include: {company : true}} }}), students: await prisma.student.findMany(), }
};


export const actions: Actions = {
    add : async({ locals, request }) => {
        const form_data = await request.formData();

        const student_id = form_data.get("studentid")?.toString();
        const position_id = form_data.get("positionid")?.toString();

        if (!student_id || !position_id) {
            redirect(302, "/about");
        }

        await prisma.student.update({
            where: { id: student_id },
            data: {
                lotteryResult: {
                    connect: {
                        id: position_id
                    }
                }
            }
        });
    },
    send_email: async({ request, locals, cookies }) => {
        console.log("send_email");
        const res = await prisma.student.findMany({include: {user: true}});

        const parentEmail = new Set(res.map(v => {
            return v.parentEmail;
        }));

        const studentEmail = new Set(res.map(v => {
            return v.user?.email;
        }));

        parentEmail.forEach(async (v) => {
            try {
                await sendEmailLotteryEmail(v);
                console.log(v);
            } catch {
                console.log("FAIL: " + v);
            }
        })

        studentEmail.forEach(async (v) => {
            if (v) {
                try {
                    await sendEmailLotteryEmail(v);
                    console.log(v);
                } catch {
                    console.log("FAIL: " + v);
                }
            }
        })
    }
}