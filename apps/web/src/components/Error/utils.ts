import { isServer } from '@/utils/ssr'

export const getMailLink = ({
	subject = 'Problem: Unable to load website',
	body,
}: {
	subject?: string
	body?: string
} = {}) => {
	if (isServer()) {
		return `mailto:hello@mplibunao.tech?subject=${encodeURIComponent(subject)}`
	}

	const message =
		body ?? `An error occured while viewing: ${window.location.href}`

	return `mailto:hello@mplibunao.tech?subject=${encodeURIComponent(
		subject,
	)}&body=${encodeURIComponent(message)}`
}

export const sliceErrorStack = (stackTrace = '', numLines = 10) => {
	const lines = stackTrace.split('\n')
	const firstNLines = lines.slice(0, numLines)
	const joinedLines = firstNLines.join('\n')
	return joinedLines
}
