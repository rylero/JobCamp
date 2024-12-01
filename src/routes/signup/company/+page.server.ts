import { PageType, userAccountSetupFlow } from '$lib/server/authFlow';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from "./$types";
import schema from "./schema.js";
import { setError, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { generateEmailVerificationCode, generatePermissionSlipCode, schoolEmailCheck, signup } from '$lib/server/auth';
import { prisma } from '$lib/server/prisma';
import { AuthError } from '$lib/server/authConstants';
import { sendEmailVerificationEmail, sendPermissionSlipEmail } from '$lib/server/email';


export const load: PageServerLoad = async (event) => {
    userAccountSetupFlow(event.locals, PageType.AccountCreation);

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

        const userId = await signup(form.data.email, form.data.password, event);
        if (userId == AuthError.IncorrectCredentials || userId == AuthError.AccountExists) {
            return fail(400, { form });
        }

        await prisma.user.update({
            where: { id: userId },
            data: {
                host: { create: {
                    name: form.data.name,
                }}
            },
            include: {
                host: true
            },
        });

        await prisma.host.update({
            where: { userId: userId },
            data: {
                company: { connectOrCreate: {
                    where: { companyName: form.data.companyName },
                    create: {
                        companyName: form.data.companyName,
                        companyDescription: form.data.companyDescription,
                        companyUrl: form.data.companyUrl,
                    }
                }}
            }
        });

        // runs in background while user is redirected
        generateEmailVerificationCode(userId, form.data.email).then(
            (code) => sendEmailVerificationEmail(form.data.email, code)
        );

        redirect(302, "/verify-email");
    }
};
  