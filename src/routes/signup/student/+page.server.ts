import { PageType, userAccountSetupFlow } from '$lib/server/authFlow';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from "./$types";
import { createStudentSchema } from "./schema";
import { message, setError, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { generateEmailVerificationCode, generatePermissionSlipCode, schoolEmailCheck, signup } from '$lib/server/auth';
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

        const school = (await prisma.school.findFirst()); // TODO: SCHOOL FIELD for multiple schools
        if (!school) {
            return message(form, "Database Error");
        }

        // if (!schoolEmailCheck(school.emailDomain).test(form.data.email)) {
        //     return setError(form, "email", "Please enter your school email.")
        // }

        if (form.data.parentEmail == form.data.email) {
            return setError(form, "parentEmail", "Please enter a different email.")
        }

        const userId = await signup(form.data.email, form.data.password, event);
        if (userId == AuthError.AccountExists) {
            return message(form, "Account Already Exists. Login instead.");
        }

        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                student: {
                    connectOrCreate: {
                        where: {
                            userId: userId,
                        },
                        create: {
                            firstName: form.data.name, // TODO: lastName
                            lastName: form.data.name,
                            grade: form.data.grade,
                            phone: form.data.phone,
                            parentEmail: form.data.parentEmail,
                            school: {
                                connect: {
                                    id: school.id
                                }
                            }
                        }
                    }
                }
            }
        });

        // runs in background while user is redirected
        const code = await generateEmailVerificationCode(userId, user.email)
        await sendEmailVerificationEmail(userId, user.email, code);

        generatePermissionSlipCode(userId, form.data.parentEmail).then(
            (code) => sendPermissionSlipEmail(form.data.parentEmail, code, form.data.name)
        );

        redirect(302, "/verify-email");
    }
};
  