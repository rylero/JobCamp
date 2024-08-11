import { Lucia, TimeSpan, generateIdFromEntropySize } from 'lucia';
import { dev } from '$app/environment';
import { hash, verify } from "@node-rs/argon2";
import { luciaAuthDb, prisma } from './prisma.js';
import type { CompanyRep, School, Student } from '@prisma/client';
import type { RequestEvent } from '@sveltejs/kit';
import { encodeHex } from 'oslo/encoding';
import { alphabet, generateRandomString, sha256 } from 'oslo/crypto';
import { TimeSpan as osloTimeSpan, createDate } from 'oslo';

export const userIdEntropySize = 10;
export const passwordResetTokenEntropySize = 25;

export const emailVerificationCodeLength = 6;
export const emailVerificationCodeCharacters = alphabet("0-9", "A-Z");

export const passwordHashingOptions = {
	memoryCost: 19456,
	timeCost: 2,
	outputLen: 32,
	parallelism: 1
};

export const sessionLifetime = new TimeSpan(2, "d");

export enum AuthError {
	IncorrectCredentials,
	AccountExists,
};

export async function createPasswordResetToken(userId: string): Promise<string> {
	await prisma.passwordResetTokens.deleteMany({ where: { user_id: userId } });
	
	const tokenId = generateIdFromEntropySize(passwordResetTokenEntropySize);
	const tokenHash = encodeHex(await sha256(new TextEncoder().encode(tokenId)));

	await prisma.passwordResetTokens.create({
		data: {
			token_hash: tokenHash,
			user_id: userId,
			expires_at: createDate(new TimeSpan(2, "h"))
		}
	});

	return tokenId;
}

export async function generateEmailVerificationCode(userId: string, email: string): Promise<string> {
	await prisma.passwordResetTokens.deleteMany({ where: { user_id: userId } });

	const code = generateRandomString(emailVerificationCodeLength, emailVerificationCodeCharacters);
	
	await prisma.emailVerificationCodes.create({
		data: {
			user_id: userId,
			email,
			code,
			expires_at: createDate(new osloTimeSpan(15, "m")) // 15 minutes
		}
	});

	return code;
}

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
    sessionExpiresIn: sessionLifetime,
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