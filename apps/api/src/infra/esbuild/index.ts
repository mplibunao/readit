import minimist from 'minimist'
import { build, analyzeMetafile } from 'esbuild'
import { globby } from 'globby'
import fs from 'fs'

/*
 *Usage: node ./esbuild.script.js --prod --app server
 *			 node ./esbuild.script.js -e 'src/**\/*.ts' -e '!src/**\/*.test.ts'
 *			 node ./esbuild.script.js --app server --analyze --saveAnalyze
 *Options:
 *  -p, --production, --prod	   Builds a production bundle. Defaults to false
 *
 *  -a, --app <app-type>			   Type of application. Defaults to `server`
 *                               Options: `server`
 *
 *  -e, --entrypoint <file/glob> Defaults to `src/index.ts`, but you can use globs too
 *															 Using globs for the entrypoint will result in multiple files vs using a single entrypoint which results in a single index.js file
 *															 I think single file is generally preferred as only code used from entrypoint is included resulting in smaller bundle size
 *															 However, you might be using some sort of file-based routing which can cause issues
 *															 You can also pass multiple -e flags to negate some files like in the example
 *															 **Note**: You must wrap the globs inside '' or else you will get an output
 *
 *			--analyze								 Analyze node_modules by bundling them. Not meant for running in dev or production
 *															 Defaults to false
 *
 *			--saveAnalyze						 Save analyze instead of printing it to console (scrollback buffer may not be able to handle console.log-ing for big projects)
 *	-w  --watch									 Watch for changes and rebuild
 *	-m	--minify								 Minify the bundle.
 */
async function main() {
	const getPlugins = (
		isProduction: boolean,
		entryPoints: Array<string>,
		_isServer: boolean
	) => {
		if (entryPoints.length > 1 || isProduction) {
			return []
		}

		return [
			//esbuildPluginFileSize({
			//showMinifiedSize: true,
			//showPluginTitle: true,
			//showBrotliSize: !isServer,
			//showGzippedSize: !isServer,
			//}),
		]
	}

	const getExternal = (): Array<string> => {
		//const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))

		//const included = new Set(['validation'])
		//const external = [...Object.keys(packageJson.dependencies)].filter(
		//(deps) => !included.has(deps)
		//)
		//return external

		return ['./node_modules/*']
	}

	const argv = minimist(process.argv.slice(2))

	const isProduction = argv.p || argv.prod || argv.production
	const analyze = argv.analyze
	const app = argv.a || argv.app || 'server'
	const isServer = app === 'server'
	const entrypoint = argv.e || argv.entrypoint || 'src/index.ts'
	const watch = argv.w || argv.watch
	const minify = argv.m || argv.minify

	const entryPoints = await globby(entrypoint)
	const plugins = getPlugins(isProduction, entryPoints, isServer)

	const result = await build({
		entryPoints,
		bundle: true,
		[entryPoints.length > 1 ? 'outdir' : 'outfile']:
			entryPoints.length > 1 ? 'dist' : 'dist/index.js',
		platform: 'node',
		target: ['esnext'],
		format: 'esm',
		external: analyze ? [] : getExternal(),
		minify: !!minify,
		color: true,
		sourcemap: true,
		plugins,
		metafile: true,
		watch: !!watch,
	})

	const text = await analyzeMetafile(result.metafile, {
		verbose: true,
	})

	if (argv.saveAnalyze) {
		fs.writeFile('analyze', text, (err) => {
			if (err) {
				console.error(err)
			}
		})
	} else {
		console.log(text)
	}
}

main()
