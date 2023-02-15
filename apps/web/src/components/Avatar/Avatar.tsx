import { capitalize } from '@api/utils/string'
import { cva, VariantProps } from 'cva'
import Image from 'next/image'
import { twMerge } from 'tailwind-merge'

const avatar = cva(['rounded-full'], {
	variants: {
		size: {
			'2xs': 'h-4 w-4',
			xs: 'h-5 w-5',
			sm: 'h-6 w-6',
			md: 'h-7 w-7',
			lg: 'h-8 w-8',
			xl: 'h-10 w-10',
			'2xl': 'h-12 w-12',
			'3xl': 'h-16 w-16',
			full: 'full',
		},
	},
	defaultVariants: { size: 'md' },
})

export interface AvatarProps extends VariantProps<typeof avatar> {
	className?: string
	src?: string | null
	name: string
}

export const Avatar = ({
	className,
	src,
	name,
	size,
}: AvatarProps): JSX.Element => {
	if (src) {
		return (
			<Image
				width={32}
				height={32}
				className={twMerge(avatar({ size }), className)}
				src={src}
				alt={`${capitalize(name)}'s avatar`}
			/>
		)
	}

	return <AvatarName name={name} className={className} />
}

interface AvatarNameProps extends VariantProps<typeof avatar> {
	name: string
	className?: string
}

export const AvatarName = ({
	name,
	className,
}: AvatarNameProps): JSX.Element => {
	return (
		<span
			className={twMerge(
				'relative inline-flex items-center justify-center shrink-0 bg-neutral-100',
				avatar({ size: 'md' }),
				className,
			)}
		>
			<span
				role='img'
				className='text-neutral-800 font-medium text-center uppercase text-base'
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
