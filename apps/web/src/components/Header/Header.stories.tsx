import { Story } from '@ladle/react'

import { Header, HeaderProps } from './Header'

const defaultProps: HeaderProps = {
	user: {
		imageUrl: null,
		firstName: 'John',
		lastName: 'Doe',
		email: 'john@example.com',
		id: '1',
		username: 'johndoe',
		createdAt: new Date(),
		updatedAt: new Date(),
		deletedAt: null,
		confirmedAt: null,
	},
}

export const LoggedIn: Story<HeaderProps> = (props) => {
	return <Header {...props} />
}

LoggedIn.args = { ...defaultProps }

export const LoggedOut: Story<HeaderProps> = (props) => {
	return <Header {...props} />
}

LoggedOut.args = { user: null }
