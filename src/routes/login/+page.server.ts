import { PageType, userAccountSetupFlow } from '$lib/server/authFlow';
import { fail, message, superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { schema } from './schema';
import { zod } from 'sveltekit-superforms/adapters';
import { prisma } from '$lib/server/prisma';
import { login } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import { AuthError } from '$lib/server/authConstants';

export const load: PageServerLoad = async (event) => {
    if (event.locals.user) {
        redirect(302, "/dashboard");
    }

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

        const res = await login(form.data.email, form.data.password, event);
        if (res == AuthError.IncorrectCredentials) {
            return message(form, "Incorrect Email or Password.");
        }
        
        const user = await prisma.user.findFirst({where: { id: res }});
        if (!user) {
            return message(form, "Error creating account. Please try again or contact support at admin@jobcamp.org.");
        }

        if (!user.emailVerified) {
            redirect(302, "/verify-email");
        }

        redirect(302, "/dashboard");
    }
}