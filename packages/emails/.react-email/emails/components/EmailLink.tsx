import { Link } from '@react-email/link'
import * as React from 'react'

export interface EmailLinkProps {
	href: string
	children: React.ReactNode
}

export const EmailLink = ({ href, children }: EmailLinkProps): JSX.Element => {
	return (
		<Link href={href} target='_blank' style={link} rel='noreferrer'>
			{children}
		</Link>
	)
}

const link = {
	color: '#067df7',
	textDecoration: 'none',
}
