import { prisma } from '$lib/server/prisma';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
	const requestData = await request.json();

	if (requestData.hosts.active == true) {
		let where: any = {};
		if (requestData.hosts.emailVerified.active) {
			where.user = {};
			where.user.emailVerified = requestData.hosts.emailVerified.value;
		}

		if (requestData.hosts.positions.active && requestData.hosts.positions.value == "=0") {
			where.positions = {};
			where.positions.none = {};
		}

		if (requestData.hosts.positions.active && requestData.hosts.positions.value == ">0") {
			where.positions = {};
			where.positions.some = {};
		}

		let data = await prisma.host.findMany({
			where: where,
			include: {
				positions: true,
				user: true,
				company: true
			}
		});
		return json(data);
	}

	return json(requestData);
}