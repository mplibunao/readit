import { getAllConfig } from 'edge-config'
import { NextRequest } from 'next/server'

export default async function getFlags(req: NextRequest) {
	const searchParams = new URL(req.url).searchParams

	if (!searchParams.has('flag')) {
		return new Response(
			JSON.stringify({
				error:
					'Invalid flag fields. You can pass multiple flag search param. One for each feature flag you want to get',
			}),
			{
				status: 400,
				statusText: 'Bad Request',
			}
		)
	}

	if (!searchParams.has('fallback')) {
		return new Response(
			JSON.stringify({
				error: 'Invalid flag fallback',
			}),
			{
				status: 400,
				statusText: 'Bad Request',
			}
		)
	}
	const keys = searchParams.getAll('flag')
	const fallback = searchParams.getAll('fallback')
	const flags = await getAllConfig(keys, fallback)
	return new Response(JSON.stringify({ ...flags }))
}

export const config = {
	runtime: 'experimental-edge',
}
