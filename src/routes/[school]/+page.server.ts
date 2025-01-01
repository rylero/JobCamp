import type { PageServerLoad } from './$types';

export const load : PageServerLoad = async ({ cookies, params, locals }) => {
    const loggedIn = locals.user != null;
    console.log(locals.user);
        
    let isHost = false;
    if (locals.user) {
        isHost = locals.user.host != null;
    }

    return { isHost, loggedIn };
};