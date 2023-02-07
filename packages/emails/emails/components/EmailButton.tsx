import { Button } from '@react-email/button'
import { Section } from '@react-email/section'
import React from 'react'

import { fontFamily } from './utils'

export interface EmailButtonProps {
	href: string
	children: React.ReactNode
}

export const EmailButton = ({
	href,
	children,
}: EmailButtonProps): JSX.Element => {
	return (
		<Section style={btnContainer}>
			<Button pX={20} pY={12} style={button} href={href}>
				{children}
			</Button>
		</Section>
	)
}

const btnContainer = {
	textAlign: 'center' as const,
}

const button = {
	fontFamily,
	backgroundColor: '#5e6ad2',
	borderRadius: '5x',
	fontWeight: '600',
	color: '#fff',
	fontSize: '15px',
	textDecoration: 'none',
	textAlign: 'center' as const,
	display: 'block',
}
