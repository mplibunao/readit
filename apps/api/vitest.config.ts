/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
	test: {
		testTimeout: 2000,
		setupFiles: [],
		coverage: {
			reporter: ['text', 'json', 'html'],
		},
		forceRerunTriggers: [
			'**/package.json/**',
			'**vitest.config.*/**',
			'src/**/*.ts',
		],
		open: false,
	},
	mode: 'test',
	plugins: [tsconfigPaths()],
})
