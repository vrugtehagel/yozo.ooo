export default function(config){
	config.setLayoutResolution(false)
	config.setLiquidOptions({ extname: '' })
	config.addPassthroughCopy('src/**/*.{css,js,yz,svg,ttf,png}')

	config.addPassthroughCopy({
		'yozo/versions.json': 'versions.json',
		'yozo/archive': 'archive',
		'yozo/tests': '-/tests',
	})

	return { dir: { input: 'src', output: 'dist' } }
}
