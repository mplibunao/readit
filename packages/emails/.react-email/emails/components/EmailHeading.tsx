import { Heading } from '@react-email/heading'
import React from 'react'

export interface HeadingProps {
	children: React.ReactNode
}

export const EmailHeading = ({ children }: HeadingProps): JSX.Element => {
	return <Heading style={heading}>{children}</Heading>
}

const heading = {
	fontFamily:
		"-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
	fontSize: '24px',
	fontWeight: '400',
	textAlign: 'center' as const,
	margin: '30px 0',
	color: '#484848',
	padding: '0',
	letterSpacing: '-0.5px',
	lineHeight: '1.3',
}
