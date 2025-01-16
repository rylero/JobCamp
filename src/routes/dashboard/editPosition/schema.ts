import { z } from "zod"

function twodigit(num: number) {
    if (num < 10) {
        return "0" + num;
    } else {
        return num
    }
}

function timeFormat(a: Date) {
    const h = a.getHours();
    const m = a.getMinutes();
    return twodigit(h)+":"+twodigit(m)
}

export const editPositionSchema = (positionProperties: any) => {
    return z.object({
        positionId: z.string().default(positionProperties.id),
        title: z.string().default(positionProperties.title),
        career: z.string().default(positionProperties.career),
        slots: z.number({message: "Expected a number"}).min(1, "Minimum of 1 slot").default(positionProperties.slots),
        summary: z.string().default(positionProperties.summary),
        fullName: z.string().default(positionProperties.contact_name),
        email: z.string().default(positionProperties.contact_email),
        address: z.string().default(positionProperties.address),
        instructions: z.string().default(positionProperties.instructions),
        attire: z.string().default(positionProperties.attire),
        arrival: z.string().default(positionProperties.arrival),
        start: z.string().default(positionProperties.start),
        release: z.string().default(positionProperties.end),
    });
}