import { z } from "zod"

export const createNewPositionSchema = (name: string, email: string) => {
    return z.object({
        title: z.string().min(1, "Required field"),
        career: z.string().min(1, "Required field"),
        slots: z.number({message: "Expected a number"}).min(1, "Minimum of 1 slot"),
        summary: z.string().min(1, "Required field"),
        fullName: z.string().min(1, "Required field").default(name),
        email: z.string().min(1, "Required field").default(email),
        address: z.string().min(1, "Required field"),
        instructions: z.string(),
        attire: z.string(),
        arrival: z.string().min(1, "Required field"),
        start: z.string().min(1, "Required field"),
        release: z.string().min(1, "Required field"),
    });
}