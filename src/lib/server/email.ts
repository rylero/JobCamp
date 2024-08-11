import { env } from "$env/dynamic/private";
import { MailtrapClient } from "mailtrap";
import verificationEmail from "$lib/emails/emailVerification.html?raw";
import resetPasswordEmail from "$lib/emails/resetPassword.html?raw";

export const emailClient = new MailtrapClient({ token: env.MAILTRAP_TOKEN });

export const SENDER = { name: "JobCamp", email: "info@jobcamp.org" };

export type EmailParams = { [index: string]: string }

export async function renderEmailTemplate(emailHtml: string, params: EmailParams) {
    Object.getOwnPropertyNames(params).forEach(name => {
        emailHtml.replaceAll("${"+name+"}", params[name]);
    });
    return emailHtml;
}

export async function sendEmailVerificationEmail(email: string, code: string) {
    await emailClient.send({
        from: SENDER,
        to:  [{ email: email }],
        subject: "Reset JobCamp Password",
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