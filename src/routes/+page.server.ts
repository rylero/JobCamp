import { PageType, userAccountSetupFlow } from '$lib/server/authFlow';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';
import { emailClient, sendHostEmail } from '$lib/server/email';

export const load: PageServerLoad = async (event) => {
    redirect(302, "/lghs");
};