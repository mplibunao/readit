import { Dependencies } from '@api/infra/diConfig'

export type UserSession = {
	id: string
}

export interface SessionService {
	setUser: (user: UserSession) => void | undefined
	getUser: () => UserSession | undefined
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
