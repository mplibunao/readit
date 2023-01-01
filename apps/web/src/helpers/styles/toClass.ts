export const toClass = (
	bool: unknown,
	className: string,
): string | undefined => {
	return bool ? className : undefined
}
