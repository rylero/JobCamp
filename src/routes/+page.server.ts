import { PageType, userAccountSetupFlow } from '$lib/server/authFlow';
import type { PageServerLoad } from './$types';

import { passwordSaltCharacters, userIdEntropySize } from '$lib/server/authConstants';
import { prisma } from '$lib/server/prisma';
import { generateRandomString } from 'oslo/crypto';
import { generateIdFromEntropySize } from 'lucia';
import { scrypt } from '$lib/server/hash';

export const load: PageServerLoad = async (event) => {
    const userId = generateIdFromEntropySize(userIdEntropySize);
	const passwordSalt = generateRandomString(16, passwordSaltCharacters); // 128bit salt
	const passwordHash = await scrypt.hash("testpassword", passwordSalt);

	await prisma.user.create({
		data: {
			id: userId,
			email: "leroy.ryan09+admin@gmail.com",
			passwordSalt,
			passwordHash,
			lastLogin: new Date(),
            school: {
                create: {
                    name: "Los Gatos High",
                    emailDomain: "lghsstudent.org",
                    webAddr: "lghs",
                }
            }
		}
	});

    userAccountSetupFlow(event.locals, PageType.NonAuth);
};