import React from 'react'

interface ClientOnlyProps {
	children: React.ReactNode
}

export function ClientOnly({ children }: ClientOnlyProps) {
	const [hasMounted, setHasMounted] = React.useState(false)

	React.useEffect(() => {
		setHasMounted(true)
	}, [])

	if (!hasMounted) {
		return null
	}
	return <div>{children}</div>
}
