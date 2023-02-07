import { Text } from '@react-email/text'
import React from 'react'

import { fontFamily } from './utils'

export interface ParagraphProps {
	children: React.ReactNode
}

export const Paragraph = ({ children }: ParagraphProps): JSX.Element => {
	return <Text style={paragraph}>{children}</Text>
}

const paragraph = {
	fontFamily,
	fontSize: '14px',
	lineHeight: '24px',
}
