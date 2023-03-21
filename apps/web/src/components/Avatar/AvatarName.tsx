import { capitalize } from '@api/utils/string'
import { cva, VariantProps } from 'cva'
import { twMerge } from 'tailwind-merge'

const avatarNameWrapper = cva(
	['inline-flex items-center justify-center rounded-full'],
	{
		variants: {
			size: {
				xs: 'h-6 w-6',
				sm: 'h-8 w-8',
				md: 'h-10 w-10',
				lg: 'h-12 w-12',
				xl: 'h-14 w-14',
			},
			color: {
				darkGray: 'bg-neutral-500',
				lightGray: 'bg-neutral-100',
			},
		},
		defaultVariants: { size: 'sm', color: 'darkGray' },
	},
)

const avatarNameText = cva(['font-medium leading-none text-center uppercase'], {
	variants: {
		size: {
			xs: 'text-xs',
			sm: 'text-sm',
			md: 'text-base',
			lg: 'text-lg',
			xl: 'text-xl',
		},
		color: {
			darkGray: 'text-white',
			lightGray: 'text-neutral-800',
		},
	},
	defaultVariants: { size: 'sm', color: 'darkGray' },
})

export interface AvatarNameProps
	extends VariantProps<typeof avatarNameWrapper> {
	name: string
	className?: string
}

export const AvatarName = ({
	name,
	className,
	color,
	size,
}: AvatarNameProps): JSX.Element => {
	return (
		<span className={twMerge(avatarNameWrapper({ size, color }), className)}>
			<span
				role='img'
				className={twMerge(avatarNameText({ size, color }), className)}
				aria-label={`${capitalize(name)}'s avatar`}
			>
				{getInitials(name)}
			</span>
		</span>
	)
}

const getInitials = (name: string) => {
	const [firstName, lastName] = name.split(' ')

	if (firstName && lastName) {
		return `${firstName.charAt(0)}${lastName.charAt(0)}`
	} else {
		return firstName!.charAt(0)
	}
}
