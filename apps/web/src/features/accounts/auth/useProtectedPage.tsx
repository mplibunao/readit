import { client } from '@/utils/trpc/client'
import { useRouter } from 'next/router'

/*
 * Name from the term protected route
 * Redirects to login page if not logged in
 * Note: Only use this on pages which only need the me query for authentication and nothing else
 *If you need to use the data for other things like passing props or rendering, better to just call it on the actual page so you can do type narrowing and render a loading screen
 */

export const useProtectedPage = () => {
	const router = useRouter()
	const { data, isLoading } = client.user.me.useQuery(undefined, {
		staleTime: Infinity,
	})

	if (!isLoading && !data) router.replace('/login')

	return { router }
}
