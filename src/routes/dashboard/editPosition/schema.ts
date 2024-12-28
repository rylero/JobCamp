import { z } from "zod"

function timeFormat(a: Date) {
    return a.getHours()+":"+a.getMinutes()+":"+a.getSeconds()
}

export const editPositionSchema = (positionProperties: any) => {
    return z.object({
        positionId: z.string(),
        title: z.string().default(positionProperties.title),
        career: z.string().default(positionProperties.career),
        slots: z.number().default(positionProperties.slots),
        summary: z.string().default(positionProperties.summary),
        fullName: z.string().default(positionProperties.contact_name),
        email: z.string().default(positionProperties.contact_email),
        address: z.string().default(positionProperties.address),
        instructions: z.string().default(positionProperties.instructions),
        attire: z.string().default(positionProperties.attire),
        arrival: z.string().default("8:00:00"), // timeFormat(positionProperties.arrival)
        start: z.string().default(timeFormat(positionProperties.start)),
        release: z.string().default(timeFormat(positionProperties.end)),
    });
}