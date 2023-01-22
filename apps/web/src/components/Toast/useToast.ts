import { atom, useAtom } from 'jotai'
import { nanoid } from 'nanoid'

export type ToastProps = {
	id?: string
	title?: string
	content: string
}

const toastsAtom = atom<ToastProps[]>([])

export const useToast = () => {
	const [toasts, setToasts] = useAtom(toastsAtom)

	const addToast = (toast: ToastProps) => {
		if (!toast.id) toast.id = nanoid()
		setToasts((old) => [...old, toast])
	}
	const removeToast = (id: string) => {
		setToasts((old) => old.filter((t) => t.id !== id))
	}

	return { toasts, addToast, removeToast }
}
