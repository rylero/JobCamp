import { z } from "zod"

export const createNewPositionSchema = (name: string, email: string) => {
    return z.object({
        title: z.string(),
        career: z.string(),
        slots: z.number().min(1, "Must have at least 1 slot."),
        summary: z.string(),
        fullName: z.string().default(name),
        email: z.string().default(email),
        address: z.string(),
        instructions: z.string(),
        attire: z.string(),
        arrival: z.string(),
        start: z.string(),
        relesase: z.string(),
    });
}