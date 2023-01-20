export const clsx = (bool: unknown, className: string): string | undefined => {
	return bool ? className : undefined
}
