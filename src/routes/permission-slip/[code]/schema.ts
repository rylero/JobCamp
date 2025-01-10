import { z } from "zod"

export const createPermissionSlipSchema = (firstName: string, lastName: string) => {
    return z.object({
        parentName: z.string().min(1, "Required"),
        phoneNumber: z.string().min(1, "Required"),
        studentFirstName: z.string().min(1, "Required").default(firstName),
        studentLastName: z.string().min(1, "Required").default(lastName),
        physicalRestrictions: z.string(),
        dietaryRestrictions: z.string(),
        emergencyTreatment: z.string().min(1, "Required"),
        studentAgreement: z.boolean(),
        liability: z.string().min(1, "Required"),
        liabilityDate: z.string().min(1, "Required"),

    })
};