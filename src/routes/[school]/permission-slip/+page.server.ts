import { PageType, userAccountSetupFlow } from '$lib/server/authFlow';
import { type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from "./$types";
import { generatePermissionSlipCode } from '$lib/server/auth';
import { sendPermissionSlipEmail } from '$lib/server/email';

export const load: PageServerLoad = async (event) => {
    userAccountSetupFlow(event.locals, PageType.PermissionSlip);
};

export const actions: Actions = {
    default: async (event) => {
        if (!event.locals.user || !event.locals.user.student) {
            return;
        }

        const userId = event.locals.user.id;
        const parentEmail = event.locals.user.student.parentEmail;

        await generatePermissionSlipCode(userId, parentEmail).then(
            (code) => sendPermissionSlipEmail(parentEmail, code)
        );
    }
}