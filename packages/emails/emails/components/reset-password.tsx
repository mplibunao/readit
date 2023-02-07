import { Head } from '@react-email/head'
import { Html } from '@react-email/html'
import { Preview } from '@react-email/preview'
import * as React from 'react'

import { EmailButton } from './EmailButton'
import { EmailHeading } from './EmailHeading'
import { EmailLink } from './EmailLink'
import { Layout, LayoutProps } from './Layout'
import { Paragraph } from './Paragraph'

export interface ResetPasswordEmailProps extends Omit<LayoutProps, 'children'> {
	resetPasswordUrl: string
	name: string
}

export const ResetPasswordEmail = ({
	companyAddress,
	logoImage,
	productName,
	resetPasswordUrl,
	name,
}: ResetPasswordEmailProps): JSX.Element => {
	return (
		<Html>
			<Head />
			<Preview>{`${productName} password reset`}</Preview>
			<Layout
				logoImage={logoImage}
				companyAddress={companyAddress}
				productName={productName}
			>
				<EmailHeading>{`Hi, ${name}`}</EmailHeading>
				<Paragraph>
					Someone recently requested a password change for your {productName}{' '}
					account. If this was you, you can set a new password here:
				</Paragraph>
				<EmailButton href={resetPasswordUrl}>Reset password</EmailButton>
				<Paragraph>
					This link and code will only be valid for the next 5 minutes. If the
					link doesn't work, you can copy and paste this URL into your browser:{' '}
					<EmailLink href={resetPasswordUrl}>{resetPasswordUrl}</EmailLink>
				</Paragraph>
				<Paragraph>
					If you don't want to change your password or didn't request this, just
					ignore and delete this message.
				</Paragraph>
				<Paragraph>
					To keep your account secure, please don't forward this email to
					anyone.
				</Paragraph>
			</Layout>
		</Html>
	)
}
