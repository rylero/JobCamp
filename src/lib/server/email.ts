import { env } from "$env/dynamic/private";
import { MailtrapClient } from "mailtrap";

export const emailClient = new MailtrapClient({ token: env.MAILTRAP_TOKEN });

export const SENDER = { name: "JobCamp", email: "info@jobcamp.org" };