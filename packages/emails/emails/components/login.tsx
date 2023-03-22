import { Head } from '@react-email/head'
import { Html } from '@react-email/html'
import { Preview } from '@react-email/preview'

import { EmailButton } from './EmailButton'
import { EmailHeading } from './EmailHeading'
import { EmailLink } from './EmailLink'
import { Layout, LayoutProps } from './Layout'
import { Paragraph } from './Paragraph'

export interface LoginEmailProps extends Omit<LayoutProps, 'children'> {
	loginUrl: string
}

export function LoginEmail({
	logoImage,
	companyAddress,
	productName,
	loginUrl,
}: LoginEmailProps) {
	return (
		<Html>
			<Head />
			<Preview>{`Login to ${productName}`}</Preview>
			<Layout
				logoImage={logoImage}
				companyAddress={companyAddress}
				productName={productName}
			>
				<EmailHeading>Your login code for {productName}</EmailHeading>
				<EmailButton href={loginUrl}>Login to {productName}</EmailButton>
				<Paragraph>
					This link and code will only be valid for the next 5 minutes. If the
					link doesn't work, you can copy and paste this URL into your browser:{' '}
					<EmailLink href={loginUrl}>{loginUrl}</EmailLink>
				</Paragraph>
				<Paragraph>
					If you didn't request this, please ignore this email
				</Paragraph>
			</Layout>
		</Html>
	)
}
