import { PageType, userAccountSetupFlow } from '$lib/server/authFlow';
import type { PageServerLoad, Actions } from "./$types";
import { createCompanySchema } from "./schema";
import { message, setError, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { generateEmailVerificationCode, generatePermissionSlipCode, schoolEmailCheck, signup } from '$lib/server/auth';
import { prisma } from '$lib/server/prisma';
import { AuthError } from '$lib/server/authConstants';
import { sendEmailVerificationEmail, sendPermissionSlipEmail } from '$lib/server/email';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
    userAccountSetupFlow(event.locals, PageType.AccountCreation);

    const schoolId = event.cookies.get("school");
    const schools = await prisma.school.findMany();
    const schoolMapping = Object.fromEntries(schools.map((val) => [val.id, val.name]));

    const form = await superValidate(zod(createCompanySchema(schoolId)));
    return { form, schoolMapping };
};

export const actions: Actions = {
    default: async (event) => {
        const { request } = event;
        const schoolIdCookie = event.cookies.get("school");
        const form = await superValidate(request, zod(createCompanySchema(schoolIdCookie)));

        if (!form.valid) {
            return fail(400, { form });
        }

        const userId = await signup(form.data.email, form.data.password, event);
        if (userId == AuthError.AccountExists) {
            return message(form, "Account Already Exists. Login instead.");
        }

        const schoolId = form.data.schoolId;
        const schoolData = await prisma.school.findFirst({where: {id: schoolId}});
        if (!schoolData) {
            return setError(form, "schoolId", "School does not exist.");
        }

        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                host: { create: {
                    name: form.data.name,
                }}
            },
            include: {
                host: true
            }
        });

        if (!user.host) {
            redirect(302, "/");
        }
        
        await prisma.company.create({
            data: {
                companyName: form.data.companyName,
                companyDescription: form.data.companyDescription,
                companyUrl: form.data.companyUrl,
                school: { connect: {
                    id: schoolData.id
                }},
                hosts: { connect: { id: user.host.id } }
            }
        });

        // runs in background while user is redirected
        generateEmailVerificationCode(userId, form.data.email).then(
            (code) => sendEmailVerificationEmail(form.data.email, code)
        );

        redirect(302, "/verify-email");
    }
};
  