import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { lucia } from "$lib/server/auth";

export const actions: Actions = {
    default: async ({ locals, cookies }) => {
        if (locals.session) {
            const session = await lucia.validateSession(locals.session.id);
            if (!session) return fail(401);
            await lucia.invalidateSession(locals.session.id);
            cookies.delete(lucia.sessionCookieName, { path: "." });
        }
        redirect(302, "/login")
    }
};