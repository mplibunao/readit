import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, UseFormProps } from 'react-hook-form'
import { TypeOf, ZodSchema } from 'zod'

export interface UseZodFormProps<Z extends ZodSchema>
	extends Exclude<UseFormProps<TypeOf<Z>>, 'resolver'> {
	schema: Z
}

export const useZodForm = <Z extends ZodSchema>({
	schema,
	...formProps
}: UseZodFormProps<Z>) =>
	useForm({
		mode: 'onChange',
		...formProps,
		resolver: zodResolver(schema),
	})
