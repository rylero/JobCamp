import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load : PageServerLoad = async ({ cookies, params, locals }) => {
    const loggedIn = locals.user != null;
    
    if (loggedIn) {
        // redirect(302, "/dashboard")
    }

    let isHost = false;
    if (locals.user) {
        isHost = locals.user.host != null;
    }

    return { isHost, loggedIn };
};