import { PageType, userAccountSetupFlow } from '$lib/server/authFlow';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { fail, setError, superValidate } from "sveltekit-superforms";
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
        console.log("Verify Request")
        const code = (await event.request.formData()).get("code");
        if (!code) {
            console.log({ msg: "Incorrect Link. Please contact support at admin@jobcamp.org."})
            return { msg: "Incorrect Link. Please contact support at admin@jobcamp.org."};
        }

        console.log(`Verify Request Code: ${code}`);

        const userId = event.locals.user?.id;
        if (!userId) { console.log("signup"); redirect(302, "/signup"); }
        console.log("signup past")
        
        const correctCode = await prisma.emailVerificationCodes.findFirst({
            where: { user_id: userId }
        });
        console.log("prisma query")

        if (!correctCode || correctCode.code != code) { 
            console.log( { msg: "Incorrect Link. Please Resend and Try again."})
            return { msg: "Incorrect Link. Please Resend and Try again."}
        }

        if (correctCode.expires_at < new Date()) {
            console.log({ msg: "Expired Link. Please Resend and Try again."})
            return { msg: "Expired Link. Please Resend and Try again."}
        }

        await prisma.user.update({
            where: { id: userId },
            data: {
                emailVerified: true,
            }
        });
        console.log("user update")
        
        await prisma.emailVerificationCodes.delete({
            where: { user_id: userId }
        });
        console.log("delete code")

        console.log("redirecting")

        redirect(302, "/dashboard")
    },
    resend: async (event) => {
        if (!event.locals.user) return;

        const email = event.locals.user.email;
        await generateEmailVerificationCode(event.locals.user.id, email).then(
            (code) => sendEmailVerificationEmail(email, code)
        );
    }
};