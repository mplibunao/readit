import { Head } from '@react-email/head'
import { Html } from '@react-email/html'
import { Preview } from '@react-email/preview'
import * as React from 'react'

import { EmailButton } from './EmailButton'
import { EmailHeading } from './EmailHeading'
import { EmailLink } from './EmailLink'
import { Layout, LayoutProps } from './Layout'
import { Paragraph } from './Paragraph'

export interface ConfirmEmailProps extends Omit<LayoutProps, 'children'> {
	productName: string
	name: string
	confirmUrl: string
}

export function ConfirmEmail({
	name,
	productName,
	logoImage,
	confirmUrl,
	companyAddress,
}: ConfirmEmailProps) {
	return (
		<Html>
			<Head />
			<Preview>
				{`${productName} is a network of communities where people can dive into their interests, hobbies and passions`}
			</Preview>
			<Layout
				logoImage={logoImage}
				companyAddress={companyAddress}
				productName={productName}
			>
				{' '}
				<EmailHeading children={`Welcome, ${name}!`} />
				<Paragraph>
					Thanks for trying {productName}. We're thrilled to have you on board.
				</Paragraph>
				<Paragraph>
					{productName} is network of communities where people can dive into
					their interests, hobbies, and passions. There's a community for
					whatever you're interested in on {productName}.
				</Paragraph>
				<Paragraph>
					To continue, please confirm your email address by clicking the button
					below:
				</Paragraph>
				<EmailButton href={confirmUrl}>Confirm Email</EmailButton>
				<Paragraph>
					<br />
					or copy and paste this URL into your browser:{' '}
					<EmailLink href={confirmUrl}>{confirmUrl}</EmailLink>
				</Paragraph>
				<Paragraph>
					Once confirmed, you'll have full access to your account:
				</Paragraph>
			</Layout>
		</Html>
	)
}
