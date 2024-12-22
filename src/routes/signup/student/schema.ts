import { z } from "zod"

import { isMobilePhone } from "$lib/server/auth";

export const createStudentSchema = (schoolId: string | undefined) => {
    if (schoolId) {
        return z.object({
            schoolId: z.string().default(schoolId),
            grade: z.number().int().min(9).max(12).default(9),
            name: z.string().min(1),
            parentEmail: z.string().email("Please enter a valid email."),
            phone: z.string().refine((arg) => isMobilePhone.test(arg), "Please enter a valid phone number."),
            allowPhoneMessaging: z.literal(true, { errorMap: () => ({ message: "You must allow SMS messaging." })}),
            email: z.string().email("Please enter a valid email."),
            password: z.string().min(8, "Password must be at least 8 characters long."),
        });
    }
    return z.object({
        schoolId: z.string(),
        grade: z.number().int().min(9).max(12),
        name: z.string().min(1),
        parentEmail: z.string().email("Please enter a valid email."),
        phone: z.string().refine((arg) => isMobilePhone.test(arg), "Please enter a valid phone number."),
        allowPhoneMessaging: z.literal(true, { errorMap: () => ({ message: "You must allow SMS messaging." })}),
        email: z.string().email("Please enter a valid email."),
        password: z.string().min(8, "Password must be at least 8 characters long."),
    });
}