import { testA11y } from '@/helpers/test/accessibility'
import { render } from '@testing-library/react'

import { Spinner } from '.'

test('Spinner renders correctly', async () => {
	const { container } = render(<Spinner />)
	await testA11y(container)
})
