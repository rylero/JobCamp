import { PageType, userAccountSetupFlow } from '$lib/server/authFlow';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';
import { emailClient, sendHostEmail } from '$lib/server/email';

export const load: PageServerLoad = async (event) => {
    console.log("test")
    const hosts = await prisma.host.findMany({
        include: {
            company: true,
            positions: true
        }
    });

    var sentHosts: any = [];
    hosts.forEach(element => {
        var pos = element.positions;
        var a: any = [];
        pos.forEach(v => {
            if (a.length > 0 && a.includes(v.contact_email)) {
                return
            }
            a.push(v.contact_email);
            try {
                sendHostEmail(v.contact_email, v);
                sentHosts.push(v.contact_email);
            } catch (error) {
                console.log("incorrect email: ", v.contact_email, v);
            }
        })
    });
    console.log(sentHosts);

    redirect(302, "/lghs");
};