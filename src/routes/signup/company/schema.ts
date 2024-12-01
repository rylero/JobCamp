import { z } from "zod"

export default z.object({
    companyName: z.string().min(1),
    companyDescription: z.string().min(1),
    companyUrl: z.string().min(1),
    name: z.string().min(1),
    email: z.string().email("Please enter a valid email."),
    password: z.string().min(8, "Password must be at least 8 characters long."),
});