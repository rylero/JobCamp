import { PageType, userAccountSetupFlow } from '$lib/server/authFlow';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { fail, setError, superValidate } from "sveltekit-superforms";
import { redirect } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
import { generateEmailVerificationCode } from '$lib/server/auth';
import { sendEmailVerificationEmail } from '$lib/server/email';

const schema = z.object({
    code: z.string()
});

export const load: PageServerLoad = async (event) => {
    if (!event.locals.user) {
        redirect(302, "/");
    }

    if (event.locals.user.emailVerified) {
        redirect(302, "/dashboard")
    }

    const form = await superValidate(zod(schema));
    return { form };
};


export const actions: Actions = {
    verify: async (event) => {
        const { request } = event;
        const form = await superValidate(request, zod(schema));
  
        if (!form.valid) {
            return fail(400, { form });
        }

        const code = form.data.code;

        const userId = event.locals.user?.id;
        if (!userId) { redirect(302, "/signup"); }
        
        const correctCode = await prisma.emailVerificationCodes.findFirst({
            where: { user_id: userId }
        });

        if (!correctCode) { redirect(302, "/signup"); }
        if (correctCode.code != code) { return setError(form, "code", "Inncorrect Verification Code.") };

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
        await generateEmailVerificationCode(event.locals.user.id, email).then(
            (code) => sendEmailVerificationEmail(email, code)
        );
    }
};