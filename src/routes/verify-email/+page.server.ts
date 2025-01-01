import type { Actions, PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import { generateEmailVerificationCode } from '$lib/server/auth';
import { sendEmailVerificationEmail } from '$lib/server/email';


export const load: PageServerLoad = async (event) => {
    if (!event.locals.user) {
        redirect(302, "/");
    }

    if (event.locals.user.emailVerified) {
        redirect(302, "/dashboard")
    }

    return { msg: "" };
};


export const actions: Actions = {
    verify: async (event) => {
        const form = await event.request.formData();
        
        const code = form.get("code")?.toString();
        if (!code) {
            return { msg: "Incorrect Link. Please contact support at admin@jobcamp.org."};
        }

        const userId = form.get("uid")?.toString();
        if (!userId) { redirect(302, "/signup"); }
        
        const correctCode = await prisma.emailVerificationCodes.findFirst({
            where: { user_id: userId }
        });

        if (!correctCode || correctCode.code != code) {
            return { msg: "Incorrect Link. Please Resend and Try again."}
        }

        if (correctCode.expires_at < new Date()) {
            return { msg: "Expired Link. Please Resend and Try again."}
        }

        await prisma.user.update({
            where: { id: userId },
            data: {
                emailVerified: true,
            }
        });
        
        await prisma.emailVerificationCodes.delete({
            where: { user_id: userId }
        });

        redirect(302, "/dashboard")
    },
    resend: async (event) => {
        if (!event.locals.user) return;

        const email = event.locals.user.email;
        const code = await generateEmailVerificationCode(event.locals.user.id, email)
        await sendEmailVerificationEmail(event.locals.user.id, email, code);
    }
};