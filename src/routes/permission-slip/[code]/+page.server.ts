    import { fail, superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { createPermissionSlipSchema } from './schema';
import { zod } from 'sveltekit-superforms/adapters';
import { prisma } from '$lib/server/prisma';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
    const code = event.params.code;
    
    const permissionSlip = await prisma.permissionSlipCode.findFirst({
        where: { code: code }
    });
    if (!permissionSlip) {
        redirect(302, "/permission-slip/error");
    }

    const student = await prisma.student.findFirst({
        where: { userId: permissionSlip.user_id }
    });
    if (!student) {
        redirect(302, "/permission-slip/error");
    }

    const form = await superValidate(zod(createPermissionSlipSchema(student.firstName, student.lastName)));
    return { form };
};

export const actions: Actions = {
    default: async (event) => {
        const { request } = event;
        const form = await superValidate(request, zod(createPermissionSlipSchema("", "")));
  
        if (!form.valid) {
            return fail(400, { form });
        }

        const userId = (await prisma.permissionSlipCode.findFirst({
            where: {code: event.params.code}
        }))?.user_id;
        if (!userId) {
            return fail(400); // TODO: handle fail with message
        }

        await prisma.permissionSlipSubmission.create({
            data: {
                user_id: userId,
                parentName: form.data.parentName,
                phoenNumber: form.data.phoneNumber,
                studentFirstName: form.data.studentFirstName,
                studentLastName: form.data.studentLastName,
                physicalRestrictions: form.data.physicalRestrictions,
                dietaryRestrictions: form.data.dietaryRestrictions,
                liability: form.data.liability,
                liabilityDate: form.data.liabilityDate
            }
        })

        await prisma.permissionSlipCode.deleteMany({
            where: {code: event.params.code}
        });

        await prisma.student.update({ where: {userId: userId}, data: {
            permissionSlipCompleted: true,
        }});
        
        redirect(302, "/permission-slip/sucess");
    }
}