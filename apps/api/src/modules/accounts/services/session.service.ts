import { Dependencies } from '@api/infra/diConfig'

type User = {
	id: string
}

export interface SessionService {
	setUser: (user: User) => void
	getUser: () => User
	destroy: () => Promise<void>
}

export const buildSessionService = ({
	session,
}: Dependencies): SessionService => ({
	setUser: (user) => session.set('user', user),
	getUser: () => session.get('user'),
	destroy: () => session.destroy(),
})
