import versions from './versions.js'
import process from 'node:process'

const runMode = process.env.ELEVENTY_RUN_MODE
const yozoPath = runMode == 'build'
	? `/archive/lib-${versions[0].number}.js`
	: `/dev-latest.js`

export default {yozoPath}
