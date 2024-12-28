import { PageType, userAccountSetupFlow } from '$lib/server/authFlow';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
    redirect(302, "/lghs");
};