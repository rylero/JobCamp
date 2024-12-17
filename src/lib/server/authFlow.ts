import { page } from "$app/stores";
import { redirect } from "@sveltejs/kit";

export enum PageType {
    NonAuth,
    Login,
    AccountCreation,
    EmailVerify,
    PermissionSlip,
    RequiresAuth,
}

export function userAccountSetupFlow(locals: App.Locals, pageType: PageType) {
    if (pageType == PageType.NonAuth) {
        return;
    }

    if (!locals.user) {
        if (pageType == PageType.AccountCreation || pageType == PageType.Login) {
            return;
        }
        
        redirect(302, "/signup");
    } else {
        if (pageType == PageType.AccountCreation || pageType == PageType.Login) {
            redirect(302, "/");
        }
    }

    if (!locals.user.emailVerified && pageType != PageType.EmailVerify) {
        redirect(302, "/verify-email");
    }

    var permissionSlipNeeded = locals.user.student && locals.user.student.permissionSlipCompleted == false;
    if (permissionSlipNeeded && pageType != PageType.PermissionSlip) {
        redirect(302, "/permission-slip");
    } else if (!permissionSlipNeeded && pageType == PageType.PermissionSlip) {
        redirect(302, "/dashboard");
    }

    return;
}