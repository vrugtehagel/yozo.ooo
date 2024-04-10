import * as fs from 'node:fs/promises'


export default function(config){
	config.setLayoutResolution(false)
	config.setLiquidOptions({ extname: '' })

	config.addGlobalData('versions', async () => {
		const json = await fs.readFile('yozo/versions.json', 'utf8')
		return JSON.parse(json)
	})

	config.addPassthroughCopy('src/**/*.{css,js,yz,svg,ttf,png,ico,txt,json}')
	config.addPassthroughCopy({
		'yozo/versions.json': 'versions.json',
		'yozo/archive': 'archive',
		'yozo/tests': '-/tests',
	})


	return { dir: { input: 'src', output: 'dist' } }
}
