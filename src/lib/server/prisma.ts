import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const luciaAuthDb = new PrismaAdapter(prisma.session, prisma.user);

export {
    prisma,
    luciaAuthDb,
}