import { env } from '@/env/server.mjs'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	// Check for secret to confirm this is a valid request
	if (req.query.secret !== env.REVALIDATE_TOKEN) {
		return res.status(401).json({ message: 'Invalid token' })
	}

	if (typeof req.query.path !== 'string') {
		return res
			.status(400)
			.json({ message: 'Invalid path. Must be of type string' })
	}

	try {
		await res.revalidate(req.query.path as string)
		return res.json({ revalidated: true })
	} catch (err) {
		// If there was an error, Next.js will continue
		// to show the last successfully generated page
		return res.status(500).send('Error revalidating')
	}
}
