import { GlobalProvider } from '@ladle/react'

import '../src/styles/global.css'

export const Provider: GlobalProvider = ({ children }) => {
	return <>{children}</>
}
