import { Head } from '@react-email/head'
import { Html } from '@react-email/html'
import { Preview } from '@react-email/preview'

import { EmailButton } from './EmailButton'
import { EmailHeading } from './EmailHeading'
import { EmailLink } from './EmailLink'
import { Layout, LayoutProps } from './Layout'
import { Paragraph } from './Paragraph'

export interface EmailHasBeenChangedProps
	extends Omit<LayoutProps, 'children'> {
	changePasswordUrl: string
	name: string
	newEmail: string
	username: string
}

export const EmailHasBeenChanged = ({
	productName,
	changePasswordUrl,
	logoImage,
	companyAddress,
	name,
	newEmail,
	username,
}: EmailHasBeenChangedProps): JSX.Element => {
	return (
		<Html>
			<Head />
			<Preview>{`[${productName}] your email address has been changed`}</Preview>

			<Layout
				logoImage={logoImage}
				companyAddress={companyAddress}
				productName={productName}
			>
				<EmailHeading>{`Hi, ${name}`}</EmailHeading>
				<Paragraph>
					The email address for {username} on {productName} has been changed to{' '}
					<EmailLink href={`mailto:${newEmail}`}>{newEmail}</EmailLink>. If you
					did not change your email, please reset your password here:
				</Paragraph>
				<EmailButton href={changePasswordUrl}>Reset Password</EmailButton>
				<Paragraph>
					This link and code will only be valid for the next 5 days. If the link
					doesn't work, you can copy and paste this URL into your browser:{' '}
					<EmailLink href={changePasswordUrl}>{changePasswordUrl}</EmailLink>
				</Paragraph>
			</Layout>
		</Html>
	)
}
