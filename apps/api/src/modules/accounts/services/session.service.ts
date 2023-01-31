import { Dependencies } from '@api/infra/diConfig'

type User = {
	id: string
}

export interface SessionService {
	setUser: (user: User) => void | undefined
	getUser: () => User | undefined
	destroy: () => Promise<void> | undefined
}

export const buildSessionService = ({
	session,
}: Dependencies): SessionService => {
	return {
		setUser: (user) => session.set('user', user),
		getUser: () => session.get('user'),
		destroy: () => session.destroy(),
	}
}
