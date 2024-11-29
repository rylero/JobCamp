import { fail, superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { schema } from './schema';
import { zod } from 'sveltekit-superforms/adapters';
import { prisma } from '$lib/server/prisma';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
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

        console.log(form.data.sample);

        const userId = (await prisma.permissionSlipCode.findFirst({
            where: {code: event.params.code}
        }))?.user_id;
        if (!userId) {
            return fail(400); // TODO: handle fail with message
        }

        await prisma.permissionSlipCode.deleteMany({
            where: {code: event.params.code}
        });

        await prisma.student.update({ where: {userId: userId}, data: {
            permissionSlipCompleted: true,
        }});

        // TODO: show successs message
        redirect(302, "/");
    }
}