import { analyzeMetafile, build } from 'esbuild'
import fs from 'fs'
import { globby } from 'globby'

async function main() {
	const entryPoints = await globby('src/**/*.ts')

	const getExternal = () => {
		const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))
		const excluded = ['pg-native', 'hiredis']
		const external = [...Object.keys(packageJson.dependencies)]
			.filter((deps) => !deps.startsWith('@readit/'))
			.concat(excluded)

		return external
	}

	const result = await build({
		entryPoints,
		bundle: true,
		outdir: 'dist',
		platform: 'node',
		target: ['esnext'],
		format: 'esm',
		external: getExternal(),
		minify: true,
		color: true,
		sourcemap: true,
		plugins: [],
		metafile: true,
	})

	const text = await analyzeMetafile(result.metafile, {
		verbose: true,
	})

	console.log(text)
}

main()
