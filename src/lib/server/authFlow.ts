import { page } from "$app/stores";
import { redirect } from "@sveltejs/kit";

export enum PageType {
    NonAuth,
    AccountCreation,
    EmailVerify,
    AccountSetup,
    Homepage,
}

export async function userAccountSetupFlow(locals: App.Locals, pageType: PageType) {
    if (pageType == PageType.NonAuth) {
        return;
    }

    if (!locals.user) {
        redirect(302, "/signup");
    }

    if (!locals.user.emailVerified && pageType != PageType.EmailVerify) {
        redirect(302, "/verify-email");
    }

    if (!locals.user.accountSetupFinished && pageType != PageType.AccountSetup) {
        redirect(302, "/account-setup");
    }
}