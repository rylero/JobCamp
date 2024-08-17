import { page } from "$app/stores";
import { redirect } from "@sveltejs/kit";

export enum PageType {
    NonAuth,
    AccountCreation,
    EmailVerify,
    AccountSetup,
    Homepage,
}

export function userAccountSetupFlow(locals: App.Locals, pageType: PageType) {
    if (pageType == PageType.NonAuth) {
        return;
    }

    if (!locals.user) {
        if (pageType == PageType.AccountCreation) {
            return;
        }
        
        redirect(302, "/signup");
    }

    if (!locals.user.emailVerified && pageType != PageType.EmailVerify) {
        redirect(302, "/verify-email");
    }
}