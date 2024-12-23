import { env } from "$env/dynamic/private";
import { MailtrapClient } from "mailtrap";
import verificationEmail from "$lib/emails/emailVerification.html?raw";
import resetPasswordEmail from "$lib/emails/resetPassword.html?raw";
import permissionSlipEmail from "$lib/emails/permissionSlip.html?raw";

export const emailClient = new MailtrapClient({ token: env.MAILTRAP_TOKEN });

export const SENDER = { name: "JobCamp", email: "info@jobcamp.org" };

export type EmailParams = { [index: string]: string }

export function renderEmailTemplate(emailHtml: string, params: EmailParams) {
    Object.getOwnPropertyNames(params).forEach(name => {
        emailHtml = emailHtml.replaceAll("${"+name+"}", params[name]);
    });
    return emailHtml;
}

export async function sendEmailVerificationEmail(email: string, code: string) {
    await emailClient.send({
        from: SENDER,
        to:  [{ email: email }],
        subject: "Verify JobCamp Email",
        html: renderEmailTemplate(verificationEmail, {code: code})
    });
}

export async function sendPasswordResetEmail(email: string, code: string) {
    await emailClient.send({
        from: SENDER,
        to:  [{ email: email }],
        subject: "Reset JobCamp Password",
        html: renderEmailTemplate(resetPasswordEmail, {code: code})
    });
}

export async function sendPermissionSlipEmail(parentEmail: string, code: string) {
    await emailClient.send({
        from: SENDER,
        to:  [{ email: parentEmail }],
        subject: "Permission Slip for Student",
        html: renderEmailTemplate(permissionSlipEmail, {link: "localhost:5173/permission-slip/"+code}) // Change url
    });
}