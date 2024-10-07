import { PageType, userAccountSetupFlow } from '$lib/server/authFlow';
import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from "./$types";
import { schema } from "./schema";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";

export const load: PageServerLoad = async (event) => {
    userAccountSetupFlow(event.locals, PageType.AccountCreation);

    const form = await superValidate(zod(schema));
    return { form };
};

export const actions: Actions = {
    default: async ({ request }) => {
      const form = await superValidate(request, zod(schema));
  
      if (!form.valid) {
        return fail(400, { form });
      }

      
    }
  };
  