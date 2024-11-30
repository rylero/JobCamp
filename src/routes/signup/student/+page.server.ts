import { PageType, userAccountSetupFlow } from '$lib/server/authFlow';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from "./$types";
import { createStudentSchema } from "./schema";
import { setError, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { generateEmailVerificationCode, generatePermissionSlipCode, signup } from '$lib/server/auth';
import { prisma } from '$lib/server/prisma';
import { AuthError } from '$lib/server/authConstants';
import { sendEmailVerificationEmail, sendPermissionSlipEmail } from '$lib/server/email';


export const load: PageServerLoad = async (event) => {
    userAccountSetupFlow(event.locals, PageType.AccountCreation);

    const schoolId = event.cookies.get("school");
    const schools = await prisma.school.findMany();
    const schoolMapping = Object.fromEntries(schools.map((val) => [val.id, val.name]));

    const form = await superValidate(zod(createStudentSchema(schoolId)));
    return { form, schoolMapping };
};

export const actions: Actions = {
    default: async (event) => {
        const { request } = event;
        const schoolIdCookie = event.cookies.get("school");
        const form = await superValidate(request, zod(createStudentSchema(schoolIdCookie)));

        if (!form.valid) {
            return fail(400, { form });
        }

        const userId = await signup(form.data.email, form.data.password, event);
        if (userId == AuthError.IncorrectCredentials || userId == AuthError.AccountExists) {
            return fail(400, { form });
        }

        const schoolId = form.data.schoolId;
        if (!schoolId || !prisma.school.findFirst({where: {id: schoolId}})) {
            return setError(form, "schoolId", "School does not exist.");
        }

        await prisma.user.update({
            where: { id: userId },
            data: {
                student: {
                    connectOrCreate: {
                        where: {
                            userId: userId,
                        },
                        create: {
                            name: form.data.name,
                            grade: form.data.grade,
                            phone: form.data.phone,
                            parentEmail: form.data.parentEmail,
                            school: {
                                connect: {
                                    id: schoolId
                                }
                            }
                        }
                    }
                }
            }
        });

        // runs in background while user is redirected
        generateEmailVerificationCode(userId, form.data.email).then(
            (code) => sendEmailVerificationEmail(form.data.email, code)
        );
        generatePermissionSlipCode(userId, form.data.parentEmail).then(
            (code) => sendPermissionSlipEmail(form.data.parentEmail, code)
        );

        redirect(302, "/verify-email");
    }
};
  