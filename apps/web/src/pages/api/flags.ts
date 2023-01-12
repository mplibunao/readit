import { FlagsService } from '@/server/infra/flags'
import { NextRequest } from 'next/server'

export default async function getFlags(req: NextRequest) {
	if (req.method !== 'POST') {
		return new Response('Not a POST request', {
			status: 405,
			statusText: 'Method Not Allowed',
		})
	}
	const body = await req.json()
	const keys = body.flag
	const fallback = body.fallback

	if (!keys || !Array.isArray(keys)) {
		return new Response(
			JSON.stringify({
				error:
					'Invalid flag fields. You can pass multiple flag search param. One for each feature flag you want to get',
			}),
			{
				status: 400,
				statusText: 'Bad Request',
			},
		)
	}

	if (!fallback || !Array.isArray(fallback)) {
		return new Response(
			JSON.stringify({
				error: 'Invalid flag fallback',
			}),
			{
				status: 400,
				statusText: 'Bad Request',
			},
		)
	}

	const flags = await FlagsService.getAll(keys, fallback)
	return new Response(JSON.stringify({ ...flags }))
}

export const config = {
	runtime: 'experimental-edge',
}
