import { Switch } from '@headlessui/react'
import { Button as AriaButton } from 'ariakit/button'
import { twMerge } from 'tailwind-merge'

export interface SettingsRowProps {
	children: React.ReactNode
	label: string
	value?: React.ReactNode
	multipleActions?: boolean
}

export const SettingsRow = ({
	children,
	label,
	value,
	multipleActions,
}: SettingsRowProps): JSX.Element => {
	return (
		<div className='py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5'>
			<dt className='text-sm font-medium text-neutral-500 capitalize'>
				{label}
			</dt>
			<dd className='mt-1 flex text-sm text-neutral-900 sm:col-span-2 sm:mt-0'>
				{value ? (
					<span className='flex-grow'>{value}</span>
				) : (
					<div className='flex-grow' />
				)}
				<span
					className={twMerge(
						'ml-4 flex-shrink-0',
						multipleActions ? 'flex items-start space-x-4' : '',
					)}
				>
					{children}
				</span>
			</dd>
		</div>
	)
}

interface ActionButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	className?: string
}

const Button = ({ children, ...props }: ActionButtonProps) => {
	return (
		<AriaButton
			className='rounded-md bg-white font-medium text-primary-600 hover:text-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
			{...props}
		>
			{children}
		</AriaButton>
	)
}

const Divider = () => (
	<span className='text-neutral-300' aria-hidden='true'>
		|
	</span>
)

export const SettingsAction = {
	Divider,
	Button,
}

export interface SwitchRowProps {
	checked: boolean
	onChange: (checked: boolean) => void
	label: string
}

export const SwitchRow = ({ checked, onChange, label }: SwitchRowProps) => {
	return (
		<Switch.Group
			as='div'
			className='py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:pt-5'
		>
			<Switch.Label
				as='dt'
				className='text-sm font-medium text-neutral-500'
				passive
			>
				{label}
			</Switch.Label>
			<dd className='mt-1 flex text-sm text-neutral-900 sm:col-span-2 sm:mt-0'>
				<Switch
					checked={checked}
					onChange={onChange}
					className={twMerge(
						checked ? 'bg-primary-600' : 'bg-neutral-200',
						'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 sm:ml-auto',
					)}
				>
					<span
						aria-hidden='true'
						className={twMerge(
							checked ? 'translate-x-5' : 'translate-x-0',
							'inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
						)}
					/>
				</Switch>
			</dd>
		</Switch.Group>
	)
}
