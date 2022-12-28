import { RenderOptions } from '@testing-library/react'
import { render } from '@testing-library/react'
import * as React from 'react'
import { FormProvider, useForm, UseFormProps } from 'react-hook-form'

export async function renderWithReactHookForm(
	ui: React.ReactElement,
	options: RenderOptions & { useFormProps?: UseFormProps } = {}
) {
	const { useFormProps, ...renderOptions } = options

	const Wrapper = ({ children }: { children: React.ReactNode }) => {
		const methods = useForm({ mode: 'onChange', ...useFormProps })
		return <FormProvider {...methods}>{children}</FormProvider>
	}
	return {
		...render(ui, { wrapper: Wrapper, ...renderOptions }),
	}
}
