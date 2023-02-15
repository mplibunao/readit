import Link, { LinkProps } from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { PropsWithChildren, useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'

export interface ActiveLinkProps extends LinkProps {
	className?: string
	activeClassName?: string
	nonActiveClassName?: string
}

//https://github.com/vercel/next.js/blob/canary/examples/active-class-name/components/ActiveLink.tsx
export const ActiveLink = React.forwardRef<
	HTMLAnchorElement,
	PropsWithChildren<ActiveLinkProps>
>((props, ref) => {
	const { children, activeClassName, nonActiveClassName, className, ...rest } =
		props
	const { asPath, isReady } = useRouter()
	const [computedClassName, setComputedClassName] = useState(className)
	const [ariaCurrent, setAriaCurrent] = useState<
		| boolean
		| 'time'
		| 'date'
		| 'true'
		| 'false'
		| 'step'
		| 'page'
		| 'location'
		| undefined
	>()

	useEffect(() => {
		// Check if the router fields are updated client-side
		if (isReady) {
			// Dynamic route will be matched via props.as
			// Static route will be matched via props.href
			const linkPathname = new URL(
				(props.as || props.href) as string,
				location.href,
			).pathname

			// Using URL().pathname to get rid of query and hash
			const activePathname = new URL(asPath, location.href).pathname

			const newClassName =
				linkPathname === activePathname
					? twMerge(className, activeClassName)
					: twMerge(className, nonActiveClassName)

			const newAriaCurrent =
				linkPathname === activePathname ? 'page' : undefined

			if (newClassName !== computedClassName) {
				setComputedClassName(newClassName)
			}

			if (newAriaCurrent !== ariaCurrent) {
				setAriaCurrent(newAriaCurrent)
			}
		}
	}, [
		asPath,
		isReady,
		props.as,
		props.href,
		activeClassName,
		className,
		computedClassName,
		nonActiveClassName,
		ariaCurrent,
	])

	return (
		<Link
			className={computedClassName}
			aria-current={ariaCurrent}
			ref={ref}
			{...rest}
		>
			{children}
		</Link>
	)
})

ActiveLink.displayName = 'ActiveLink'
