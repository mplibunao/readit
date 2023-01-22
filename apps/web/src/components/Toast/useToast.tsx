import toast from 'react-hot-toast'

import { SuccessToast, ErrorToast } from './Toast'
import { ToastProps } from './Toast'

type useToastProps = Omit<ToastProps, 'toast'>

type useToast = (props: useToastProps) => void

export const successToast: useToast = (props) => {
	toast.custom((t) => <SuccessToast {...props} toast={t} />)
}

export const errorToast: useToast = (props) => {
	toast.custom((t) => <ErrorToast {...props} toast={t} />)
}
