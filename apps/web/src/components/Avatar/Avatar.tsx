import { capitalize } from '@api/utils/string'
import { cva, VariantProps } from 'cva'
import Image from 'next/image'
import { twMerge } from 'tailwind-merge'

import { AvatarName, AvatarNameProps } from './AvatarName'

const avatar = cva(['rounded-full inline-block'], {
	variants: {
		size: {
			xs: 'h-6 w-6',
			sm: 'h-8 w-8',
			md: 'h-10 w-10',
			lg: 'h-12 w-12',
			xl: 'h-14 w-14',
		},
	},
	defaultVariants: { size: 'sm' },
})

export interface AvatarProps extends VariantProps<typeof avatar> {
	className?: string
	src?: string | null
	name: string
	color?: AvatarNameProps['color']
}

export const Avatar = ({
	className,
	src,
	name,
	size,
	color,
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

	return (
		<AvatarName name={name} className={className} size={size} color={color} />
	)
}
