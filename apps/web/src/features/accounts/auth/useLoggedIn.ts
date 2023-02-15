import { client } from '@/utils/trpc/client'
import { useRouter } from 'next/router'

interface UseLoggedIn {
	redirectTo?: string
}

export const useLoggedIn = ({ redirectTo = '/' }: UseLoggedIn = {}) => {
	const router = useRouter()
	const { data } = client.user.me.useQuery()

	if (data) {
		if (typeof router.query.next === 'string') {
			router.replace(router.query.next)
		} else {
			router.replace(redirectTo)
		}
	}
}
