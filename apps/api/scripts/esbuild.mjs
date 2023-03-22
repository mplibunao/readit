import { build, analyzeMetafile } from 'esbuild'
import fs from 'fs'
import { globby } from 'globby'
import minimist from 'minimist'

/*
 *Usage: node ./esbuild.script.js --watch --minify --types
 *			 node ./esbuild.script.js -e 'src/**\/*.ts' -e '!src/**\/*.test.ts'
 *			 node ./esbuild.script.js --analyze --saveAnalyze
 *
 *Options:
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
 *	-d	--directory							 Directory to output the bundle to. Defaults to `dist`
 *	-i  --incremental 					 Incremental build. Defaults to false
 */
async function main() {
	const getPlugins = () => {
		const plugins = [nativeNodeModulesPlugin]

		return plugins
	}

	const getExternal = () => {
		const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))

		// Manually include/exclude any packages
		//const included = new Set([])
		const excluded = ['pg-native', 'hiredis', 'preview-email']

		const external = [...Object.keys(packageJson.dependencies)]
			.filter((deps) => !deps.startsWith('@readit/'))
			.concat(excluded)

		return external

		//return ['./node_modules/*']
	}

	const argv = minimist(process.argv.slice(2))

	const analyze = argv.analyze
	const entrypoint = argv.e || argv.entrypoint || 'src/index.ts'
	const watch = argv.w || argv.watch
	const minify = argv.m || argv.minify
	const directory = argv.d || argv.directory || 'dist'
	const incremental = argv.i || argv.incremental

	const entryPoints = await globby(entrypoint)
	const plugins = getPlugins()

	const result = await build({
		entryPoints,
		bundle: true,
		[entryPoints.length > 1 ? 'outdir' : 'outfile']:
			entryPoints.length > 1 ? directory : `${directory}/index.js`,
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
		incremental: !!incremental,
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
		//console.log(text)
	}
}

main()

// https://github.com/egoist/tsup/blob/dev/src/esbuild/native-node-module.ts
const nativeNodeModulesPlugin = {
	name: 'native-node-modules',
	setup(build) {
		// If a ".node" file is imported within a module in the "file" namespace, resolve
		// it to an absolute path and put it into the "node-file" virtual namespace.
		build.onResolve({ filter: /\.node$/, namespace: 'file' }, (args) => {
			const resolvedId = require.resolve(args.path, {
				paths: [args.resolveDir],
			})
			if (resolvedId.endsWith('.node')) {
				return {
					path: resolvedId,
					namespace: 'node-file',
				}
			}
			return {
				path: resolvedId,
			}
		})

		// Files in the "node-file" virtual namespace call "require()" on the
		// path from esbuild of the ".node" file in the output directory.
		build.onLoad({ filter: /.*/, namespace: 'node-file' }, (args) => {
			return {
				contents: `
            import path from ${JSON.stringify(args.path)}
            try { module.exports = require(path) }
            catch {}
          `,
				resolveDir: path.dirname(args.path),
			}
		})

		// If a ".node" file is imported within a module in the "node-file" namespace, put
		// it in the "file" namespace where esbuild's default loading behavior will handle
		// it. It is already an absolute path since we resolved it to one above.
		build.onResolve({ filter: /\.node$/, namespace: 'node-file' }, (args) => ({
			path: args.path,
			namespace: 'file',
		}))

		// Tell esbuild's default loading behavior to use the "file" loader for
		// these ".node" files.
		const opts = build.initialOptions
		opts.loader = opts.loader || {}
		opts.loader['.node'] = 'file'
	},
}
