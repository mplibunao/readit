import { client } from '@/utils/trpc/client'
import { PROTECTED_PROCEDURE_AUTH_ERROR_TYPE } from '@api/utils/errors/errorTypes'
import { atom, useAtom } from 'jotai'
import { useRouter } from 'next/router'

import { UserNavigation } from '..'
import { errorToast, successToast } from '../../Toast'

const navIsOpenAtom = atom<boolean>(false)

export const useNav = () => {
	const [navIsOpen, setNavIsOpen] = useAtom(navIsOpenAtom)
	const trpcUtils = client.useContext()
	const router = useRouter()

	const { data: user } = client.user.me.useQuery()

	const logoutMutation = client.auth.logout.useMutation({
		onError: (error) => {
			switch (error.data?.type) {
				case PROTECTED_PROCEDURE_AUTH_ERROR_TYPE:
					errorToast({
						title: 'Already logged out',
						message: 'Redirecting to home page',
					})
					router.reload()
					break
				default:
					return errorToast({
						title: 'Error logging out',
						message: error.message,
					})
			}
		},
		onSuccess: () => {
			successToast({
				title: 'Successfully logged out',
				message: 'See you soon!',
			})
			if (router.pathname !== '/') {
				trpcUtils.user.me.invalidate()
				router.push('/')
			} else {
				router.reload()
			}
		},
	})

	const userNavigation: UserNavigation[] = [
		{ name: 'Profile', href: '/user/' },
		{ name: 'Settings', href: '/settings' },
		{
			name: 'Sign out',
			onClick: () => {
				logoutMutation.mutate()
			},
		},
	]

	return { navIsOpen, setNavIsOpen, user, userNavigation, router }
}
