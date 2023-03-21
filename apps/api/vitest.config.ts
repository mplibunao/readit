/// <reference types="vitest" />

import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		testTimeout: 2000,
		setupFiles: [],
		//globalSetup: ['./src/infra/pg/migration.ts'],
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
