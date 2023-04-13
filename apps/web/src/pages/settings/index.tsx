import { Avatar } from '@/components/Avatar'
import { Layout, MainLayout, SettingsLayout } from '@/components/Layout'
import { styledLink } from '@/components/Link'
import { useDisclosure } from '@/components/Modal'
import { LoadingPage } from '@/components/Spinner'
import { errorToast, successToast } from '@/components/Toast'
import {
	OAUTH_DISABLED,
	OAUTH_URL,
	Provider,
	providers,
} from '@/constants/oauth'
import {
	useVerificationEmail,
	VerificationEmailModal,
} from '@/features/accounts/auth'
import {
	ChangePasswordModal,
	SettingsAction,
	SettingsRow,
	SettingsSection,
	ChangeEmailModal,
} from '@/features/accounts/settings'
import { client } from '@/utils/trpc/client'
import { getFullName } from '@api/utils/string'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

import { NextPageWithLayout } from '../_app'

export const SettingsIndex: NextPageWithLayout = (): JSX.Element => {
	const router = useRouter()
	const trpcUtils = client.useContext()
	const confirmEmailQuery = router.query['confirm-email']
	const { data, isLoading } = client.user.getStatus.useQuery(undefined, {
		staleTime: Infinity,
	})
	const showChangePasswordModal = useDisclosure()
	const showChangeEmailModal = useDisclosure()

	const unlinkSocialMutation = client.auth.unlinkSocialAccount.useMutation({
		onError: (error) => {
			errorToast({
				title: 'Failed to unlink social account',
				message: error.message,
			})
		},
		onSuccess: (provider) => {
			trpcUtils.user.getStatus.invalidate()
			successToast({
				title: 'Successfully unlinked social account',
				message: `You may now login using your ${provider} account`,
			})
		},
	})

	const confirmationEmailModal = useVerificationEmail({
		resendCooldownMinutes: 1,
	})

	React.useEffect(() => {
		if (confirmEmailQuery === 'open') {
			confirmationEmailModal.onOpen()
		} else if (confirmEmailQuery === 'close') {
			confirmationEmailModal.onClose()
		}
	}, [confirmEmailQuery, confirmationEmailModal])

	const resendConfirmEmailMutation =
		client.auth.resendConfirmationEmail.useMutation({
			onError: (error) => {
				errorToast({
					title: 'Failed to resend confirmation email',
					message: error.message,
				})
			},
			onSuccess() {
				successToast({
					title: 'Confirmation email resent',
					message: 'Please check your email',
				})
				confirmationEmailModal.resetResendEmailCooldown()
			},
		})

	if (!router.isReady) return <LoadingPage />
	if (isLoading) return <LoadingPage />
	if (!isLoading && !data) {
		router.replace('/login')
	}
	if (!data) return <LoadingPage />

	const unconnectedSocials = providers.filter(
		(provider) =>
			!data?.socialAccounts.some((social) => social.provider === provider),
	)

	const handleCloseConfirmEmailModal = () => {
		confirmationEmailModal.onClose()
		router.push('/settings?confirm-email=close', undefined, { shallow: true })
	}

	return (
		<>
			<ChangePasswordModal
				onClose={showChangePasswordModal.onClose}
				isOpen={showChangePasswordModal.isOpen}
				userId={data.id}
				hasPassword={data.hasPassword}
			/>
			<VerificationEmailModal
				isOpen={confirmationEmailModal.isOpen}
				onClose={handleCloseConfirmEmailModal}
				handleResendEmail={() => resendConfirmEmailMutation.mutate()}
				remainingTime={confirmationEmailModal.remainingTime}
				allowResendEmail={confirmationEmailModal.allowResendEmail}
			/>
			<ChangeEmailModal
				isOpen={showChangeEmailModal.isOpen}
				onClose={showChangeEmailModal.onClose}
				userId={data.id}
				hasPassword={data.hasPassword}
			/>
			<SettingsSection
				title='Account'
				subtitle='Manage account settings and preferences'
			>
				<SettingsRow label='Email' value={data?.email}>
					<SettingsAction.Button onClick={() => showChangeEmailModal.onOpen()}>
						Change
					</SettingsAction.Button>
				</SettingsRow>

				<SettingsRow
					label='Photo'
					value={<Avatar src={data?.imageUrl} name={getFullName(data)} />}
					multipleActions
				>
					<SettingsAction.Button>Update</SettingsAction.Button>
					<SettingsAction.Divider />
					<SettingsAction.Button>Remove</SettingsAction.Button>
				</SettingsRow>

				<SettingsRow label='Status' value={data?.status}>
					{data?.status === 'Unconfirmed' ? (
						<SettingsAction.Button
							onClick={() => confirmationEmailModal.onOpen()}
						>
							Resend confirmation email
						</SettingsAction.Button>
					) : null}
				</SettingsRow>

				<SettingsRow
					label='Password'
					value={data?.hasPassword ? '********' : 'Not Set'}
				>
					<SettingsAction.Button onClick={showChangePasswordModal.onOpen}>
						Change
					</SettingsAction.Button>
				</SettingsRow>
			</SettingsSection>

			<SettingsSection
				title='Connected Accounts'
				subtitle='Connect to social accounts to enable logging in with them'
			>
				{data?.socialAccounts.map((social) => {
					return (
						<SettingsRow
							key={social.provider}
							label={social.provider}
							value={social.usernameOrEmail}
						>
							<SettingsAction.Button
								disabled={
									unlinkSocialMutation.isLoading ||
									OAUTH_DISABLED[social.provider as Provider]
								}
								onClick={() => unlinkSocialMutation.mutate(social.id)}
							>
								Disconnect
							</SettingsAction.Button>
						</SettingsRow>
					)
				})}

				{unconnectedSocials.map((provider) => {
					return (
						<SettingsRow key={provider} label={provider}>
							<Link
								className={styledLink({ disabled: OAUTH_DISABLED[provider] })}
								href={OAUTH_URL[provider]}
							>
								Connect
							</Link>
						</SettingsRow>
					)
				})}
			</SettingsSection>
		</>
	)
}

SettingsIndex.getLayout = (page) => (
	<Layout>
		<MainLayout bgClass='bg-white'>
			<SettingsLayout>{page}</SettingsLayout>
		</MainLayout>
	</Layout>
)

export default SettingsIndex
