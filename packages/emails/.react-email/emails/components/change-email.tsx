import { Head } from '@react-email/head'
import { Html } from '@react-email/html'
import { Preview } from '@react-email/preview'

import { EmailButton } from './EmailButton'
import { EmailHeading } from './EmailHeading'
import { EmailLink } from './EmailLink'
import { Layout, LayoutProps } from './Layout'
import { Paragraph } from './Paragraph'

export interface ChangeEmailProps extends Omit<LayoutProps, 'children'> {
	changeEmailUrl: string
	name: string
	newEmail: string
	username: string
}

export const ChangeEmail = ({
	productName,
	changeEmailUrl,
	logoImage,
	companyAddress,
	name,
	newEmail,
	username,
}: ChangeEmailProps): JSX.Element => {
	return (
		<Html>
			<Head />
			<Preview>{`${productName} change email`}</Preview>

			<Layout
				logoImage={logoImage}
				companyAddress={companyAddress}
				productName={productName}
			>
				<EmailHeading>{`Hi, ${name}`}</EmailHeading>
				<Paragraph>
					Someone recently requested an email change for your {username}{' '}
					{productName} account to be changed to{' '}
					<EmailLink href={`mailto:${newEmail}`}>{newEmail}</EmailLink>. To
					proceed, please click the button below:
				</Paragraph>
				<EmailButton href={changeEmailUrl}>Verify Email Address</EmailButton>
				<Paragraph>
					This link and code will only be valid for the next 3 days. If the link
					doesn't work, you can copy and paste this URL into your browser:{' '}
					<EmailLink href={changeEmailUrl}>{changeEmailUrl}</EmailLink>
				</Paragraph>
				<Paragraph>
					If this was not you, just ignore and delete this message as there's
					nothing else you need to do
				</Paragraph>
			</Layout>
		</Html>
	)
}
