import { Lucia, TimeSpan, generateIdFromEntropySize } from 'lucia';
import { dev } from '$app/environment';
import { hash, verify } from "@node-rs/argon2";
import { luciaAuthDb, prisma } from './prisma.js';
import type { CompanyRep, School, Student } from '@prisma/client';
import type { RequestEvent } from '@sveltejs/kit';

export const userIdEntropySize = 10;

export const passwordHashingOptions = {
	memoryCost: 19456,
	timeCost: 2,
	outputLen: 32,
	parallelism: 1
};

export async function setNewLuciaSession(userId: string, event: RequestEvent) {
	const session = await lucia.createSession(userId, {});
	const sessionCookie = lucia.createSessionCookie(session.id);
	event.cookies.set(sessionCookie.name, sessionCookie.value, {
		path: ".",
		...sessionCookie.attributes,
	});
}

export async function updateLastLoginToNow(userId: string) {
	await prisma.user.update({
		where: {
			id: userId
		}, 
		data: {
			lastLogin: new Date()
		}
	})
}

export enum AuthError {
	IncorrectCredentials,
	AccountExists,
};

export async function login(email: string, password: string, event: RequestEvent): Promise<AuthError | undefined> {
	const existingUser = await prisma.user.findFirst({ where: { email } });
	if (!existingUser) {
		return AuthError.IncorrectCredentials;
	}

	const validPassword = await verify(existingUser.passwordHash, password, passwordHashingOptions);
	if (!validPassword) {
		return AuthError.IncorrectCredentials;
	}

	updateLastLoginToNow(existingUser.id);

	setNewLuciaSession(existingUser.id, event);
}

export async function signup(email: string, password: string, event: RequestEvent): Promise<AuthError | undefined> {
	const existingUser = await prisma.user.findFirst({ where: { email } });
	if (existingUser) {
		return AuthError.AccountExists;
	}

	const userId = generateIdFromEntropySize(userIdEntropySize);
	const passwordHash = await hash(password, passwordHashingOptions);

	await prisma.user.create({
		data: {
			id: userId,
			email,
			passwordHash,
			lastLogin: new Date(),
		}
	});

	setNewLuciaSession(userId, event);
}

export const lucia = new Lucia(luciaAuthDb, {
    sessionExpiresIn: new TimeSpan(2, "d"),
    sessionCookie: {
        attributes: {
			// set to `true` when using HTTPS
            secure: !dev
        }
    },
    getUserAttributes: (attributes) => {
		return {
			// attributes has the type of DatabaseUserAttributes
			email: attributes.email,
			emailVerified: attributes.emailVerified,
            student: attributes.student,
            companyRep: attributes.companyRep,
            school: attributes.school,
            lastLogin: attributes.lastLogin,
		};
	}
});

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

interface DatabaseUserAttributes {
	email: string;
	emailVerified: boolean;
    student: Student | null;
    companyRep: CompanyRep | null;
    school: School | null;
    lastLogin: Date;
}