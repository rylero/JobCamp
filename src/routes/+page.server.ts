import { PageType, userAccountSetupFlow } from '$lib/server/authFlow';
import { prisma } from '$lib/server/prisma';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
    userAccountSetupFlow(event.locals, PageType.NonAuth);
};