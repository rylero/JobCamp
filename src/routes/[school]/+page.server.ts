import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';
import { redirect } from '@sveltejs/kit';

export const load : PageServerLoad = async ({ params }) => {
    const schoolData = await prisma.school.findFirst({ where: { webAddr: params.school }});

    // school addr dosent exist
    if (schoolData == undefined) {
        redirect(302, "/");
    }

    return { schoolData };
};