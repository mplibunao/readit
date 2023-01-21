import { ComponentProps } from 'react'
import {
	FieldValues,
	FormProvider,
	SubmitHandler,
	UseFormReturn,
} from 'react-hook-form'

interface Props<T extends FieldValues>
	extends Omit<ComponentProps<'form'>, 'onSubmit'> {
	form: UseFormReturn<T>
	onSubmit: SubmitHandler<T>
}

export const Form = <T extends FieldValues>({
	form,
	onSubmit,
	children,
	...props
}: Props<T>) => (
	<FormProvider {...form}>
		<form onSubmit={form.handleSubmit(onSubmit)} {...props}>
			<fieldset disabled={form.formState.isSubmitting}>{children}</fieldset>
		</form>
	</FormProvider>
)
