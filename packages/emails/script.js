const fs = require('fs')

function copyEmailComponents() {
	const srcPath = 'emails/components'
	const destPath = '../../apps/api/src/infra/mailer/components'
	try {
		console.log(`Copying email components from ${srcPath} to ${destPath}...`)
		fs.cpSync(srcPath, destPath, { recursive: true })
	} catch (error) {
		console.error('Copying email components failed', error)
	}
}

copyEmailComponents()
