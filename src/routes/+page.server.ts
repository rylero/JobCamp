import { PageType, userAccountSetupFlow } from '$lib/server/authFlow';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = (event) => {
    userAccountSetupFlow(event.locals, PageType.NonAuth);
};