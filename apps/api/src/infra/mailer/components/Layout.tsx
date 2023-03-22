import { Container } from '@react-email/container'
import { Hr } from '@react-email/hr'
import { Img } from '@react-email/img'
import { Section } from '@react-email/section'
import { Text } from '@react-email/text'
import * as React from 'react'

import { Paragraph } from './Paragraph'
import { fontFamily } from './utils'

export interface LayoutProps {
	children: React.ReactNode
	logoImage: string
	productName: string
	companyAddress: string
}

export const Layout = ({
	children,
	logoImage,
	productName,
	companyAddress,
}: LayoutProps) => {
	return (
		<Section style={main}>
			<Container style={container}>
				<Section style={{ marginTop: '32px' }}>
					<Img src={logoImage} width='57' height='57' alt='Logo' style={logo} />
				</Section>
				{children}
				<Paragraph>
					Best,
					<br />
					The {productName} team
				</Paragraph>
				<Hr style={hr} />
				<Text style={footer}>{companyAddress}</Text>
			</Container>
		</Section>
	)
}

const main = {
	backgroundColor: '#ffffff',
	margin: '0 auto',
}

const container = {
	border: '1px solid #eaeaea',
	borderRadius: '5px',
	margin: '40px auto',
	padding: '20px',
	width: '465px',
}

const logo = {
	margin: '0 auto',
}

const footer = {
	fontFamily,
	color: '#8898aa',
	fontSize: '12px',
}

const hr = {
	borderColor: '#cccccc',
	margin: '20px 0',
}
