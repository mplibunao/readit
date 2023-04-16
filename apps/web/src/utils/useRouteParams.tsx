import { useRouter } from 'next/router'

export const useRouteParams = (fields: string[]) => {
	const router = useRouter()
	const params: Record<string, string> = {}

	for (const field of fields) {
		const param = router.query[field]
		if (typeof param === 'string') {
			params[field] = param
		}
	}

	return params
}
