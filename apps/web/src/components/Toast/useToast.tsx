import toast, { ToastOptions } from 'react-hot-toast'

import { SuccessToast, ErrorToast } from './Toast'
import { ToastProps } from './Toast'

type useToastProps = Omit<ToastProps, 'toast'>

type useToast = (props: useToastProps, options?: ToastOptions) => void

export const successToast: useToast = (props, options) => {
	toast.custom((t) => <SuccessToast {...props} toast={t} />, options)
}

export const errorToast: useToast = (props, options) => {
	toast.custom((t) => <ErrorToast {...props} toast={t} />, options)
}
