import { z } from "zod"

import { isMobilePhone } from "$lib/utils";

export const schema = z.object({
    schoolId: z.string(),
    grade: z.number().int().min(9).max(12),
    name: z.string().min(1),
    parentEmail: z.string().email("Please enter a valid email."),
    phone: z.string().refine((arg) => isMobilePhone.test(arg), "Please enter a valid phone number."),
    allowPhoneMessaging: z.literal(true, { errorMap: () => ({ message: "You must accept phone messages." })}),
    email: z.string().email("Please enter a valid email."),
    password: z.string().min(8, "Password must be at least 8 characters long."),
});