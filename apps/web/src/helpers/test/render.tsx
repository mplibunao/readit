import { RenderOptions } from '@testing-library/react'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'
import { FormProvider } from 'react-hook-form'
import { ZodSchema } from 'zod'

import { useZodForm, UseZodFormProps } from '../forms/useZodForm'

export async function renderWithReactHookForm<Z extends ZodSchema>(
	ui: React.ReactElement,
	options: RenderOptions & { useFormProps: UseZodFormProps<Z> },
) {
	const { useFormProps, ...renderOptions } = options

	const Wrapper = ({ children }: { children: React.ReactNode }) => {
		const methods = useZodForm({
			mode: 'onChange',
			...useFormProps,
		})
		return <FormProvider {...methods}>{children}</FormProvider>
	}
	return {
		user: userEvent.setup(),
		...render(ui, { wrapper: Wrapper, ...renderOptions }),
	}
}
