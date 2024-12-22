import { PageType, userAccountSetupFlow } from '$lib/server/authFlow';
import type { PageServerLoad } from "./$types";

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
        if (userId == AuthError.IncorrectCredentials || userId == AuthError.AccountExists) {
            return fail(400, { form });
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
        await prisma.host.update({
            where: { userId: userId },
            data: {
                company: { connectOrCreate: {
                    where: { companyName: form.data.companyName },
                    create: {
                        companyName: form.data.companyName,
                        companyDescription: form.data.companyDescription,
                        companyUrl: form.data.companyUrl,
                        school: { connect: {
                            id: schoolId
                        }}
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
  