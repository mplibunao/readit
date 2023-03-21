import { FormHeading } from '@/components/Forms'

export interface SettingsSectionProps {
	title: string
	subtitle?: string
	children: React.ReactNode
}

export const SettingsSection = ({
	title,
	subtitle,
	children,
}: SettingsSectionProps): JSX.Element => {
	return (
		<div className='mt-10 divide-y divide-neutral-200'>
			<div className='space-y-1'>
				<FormHeading title={title} subtitle={subtitle} />
			</div>
			<div className='mt-6'>
				<dl className='divide-y divide-neutral-200'>{children}</dl>
			</div>
		</div>
	)
}
