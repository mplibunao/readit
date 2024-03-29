import '@testing-library/jest-dom/extend-expect'

import { RenderOptions } from '@testing-library/react'
import { render } from '@testing-library/react'
import { axe, JestAxeConfigureOptions, toHaveNoViolations } from 'jest-axe'
import * as React from 'react'

expect.extend(toHaveNoViolations)

export async function testA11y(
	ui: React.ReactElement | HTMLElement,
	options: RenderOptions & { axeOptions?: JestAxeConfigureOptions } = {},
) {
	const { axeOptions, ...rest } = options
	const container = React.isValidElement(ui) ? render(ui, rest).container : ui
	const results = await axe(container as HTMLElement, axeOptions)
	expect(results).toHaveNoViolations()
}
