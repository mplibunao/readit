#!/usr/bin/env zx
// <reference 'zx/globals' />
import 'zx/globals'

await $`pnpm prisma db pull`

const date = new Date().toISOString()
console.log('date', date) // eslint-disable-line no-console

const directories = await $`ls prisma/migrations`
console.log('directories', directories) // eslint-disable-line no-console
directories.filter((dir) => {
	// what
	new RegExp('^[0-9]{4}').test(dir)
})
