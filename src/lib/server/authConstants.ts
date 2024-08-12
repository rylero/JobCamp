import type { CompanyRep, School, Student } from '@prisma/client';
import { TimeSpan } from 'lucia';
import { alphabet } from 'oslo/crypto';

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

export interface DatabaseUserAttributes {
	email: string;
	emailVerified: boolean;
    student: Student | null;
    companyRep: CompanyRep | null;
    school: School | null;
	accountSetupFinished: boolean;
    lastLogin: Date;
}