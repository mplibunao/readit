const fs = require('fs')
const path = require('path')
const iconPipeline = require('icon-pipeline')

const iconFolder = path.join(__dirname, '..', 'src', 'icons', 'raw')
const processedFolder = path.join(__dirname, '..', 'src', 'icons', 'processed')
const svgSpritePath = path.join(__dirname, '../src/icons/processed/sprite.svg')
const finalSvgSpritePath = path.join(__dirname, '../public/sprite.svg')
const listPath = path.join(__dirname, '../src/components/Icon/types.ts')

async function makeIcons() {
	let iconData
	try {
		iconData = await iconPipeline({
			srcDir: iconFolder,
			outputDir: processedFolder,
			/* Includes the sprite.js && sprite.svg in original icon directory */
			includeSpriteInSrc: false,
			/* Turn off additional svg classes added for advanced styling */
			// disableClasses: true,
			/* Namespace of icon IDs. Will prefix icon names. Example 'foo.svg' will become 'company-foo' */
			// namespace: 'company'
		})
	} catch (error) {
		throw new Error(`icon pipeline error ${error.message}`)
	}

	generateIdTypes(iconData)
	copySvgSprite(svgSpritePath, finalSvgSpritePath)
}

const generateIdTypes = (iconData) => {
	const type = `export type IconId = ${Object.keys(iconData.iconMap)
		.map((key) => `'${key}'`)
		.join(' | ')}\n`

	fs.writeFile(listPath, type, (err) => {
		if (err) {
			throw new Error(`error writing icon types ${err.message}`)
		}

		console.log('icon types generated')
	})
}

const copySvgSprite = (src, dest) => {
	fs.copyFile(src, dest, (err) => {
		if (err) {
			throw new Error(`error copying svg sprite ${err.message}`)
		}

		console.log('svg sprite copied')
	})
}

makeIcons()
