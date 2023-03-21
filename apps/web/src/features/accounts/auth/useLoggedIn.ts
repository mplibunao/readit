import { client } from '@/utils/trpc/client'
import { useRouter } from 'next/router'

interface UseLoggedIn {
	redirectTo?: string
	/*
	 * Change this if you don't want to get redirected suddenly when you get authenticated in the middle of doing something
	 * Eg. When creating a new account, a modal regarding the confirmation email pops up which allows you to resend the email. However, session is also set so you're automatically redirected to home page.
	 */
	staleTime?: number
}

export const useLoggedIn = ({
	redirectTo = '/',
	staleTime = 20 * 1000,
}: UseLoggedIn = {}) => {
	const router = useRouter()
	const { data } = client.user.me.useQuery(undefined, {
		staleTime,
	})

	if (data) {
		if (typeof router.query.next === 'string') {
			router.replace(router.query.next)
		} else {
			router.replace(redirectTo)
		}
	}
}
