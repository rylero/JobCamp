import { PageType, userAccountSetupFlow } from '$lib/server/authFlow';
import { z } from 'zod';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { fail, setError, superValidate } from "sveltekit-superforms";
import { redirect } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';

const schema = z.object({
    code: z.string()
});

export const load: PageServerLoad = async (event) => {
    userAccountSetupFlow(event.locals, PageType.EmailVerify);

    const form = await superValidate(zod(schema));
    return { form };
};


export const actions: Actions = {
    default: async (event) => {
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

        redirect(302, "/");
    }
};