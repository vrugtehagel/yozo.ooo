import versions from './versions.js'

const runMode = Deno.env.get('ELEVENTY_RUN_MODE')
const yozoPath = runMode == 'build'
	? `/archive/lib-${versions[0].number}.js`
	: `/dev-latest.js`

export default {yozoPath}
