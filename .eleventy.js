import { customMarkdown } from './plugins/custom-markdown.js'

export default function(config){
	config.setFrontMatterParsingOptions({language: 'json'});
	config.setLayoutResolution(false)
	config.setLiquidOptions({extname: ''})
	config.addPlugin(customMarkdown)

	config.addPassthroughCopy('src/-/**/*.{css,js,yz,svg,ttf,png,ico,txt,json}')
	config.addPassthroughCopy('src/*.{js,ico,svg}')
	config.addPassthroughCopy('src/**/index.{css,js}')
	config.addPassthroughCopy({
		'yozo/versions.json': 'versions.json',
		'yozo/archive': 'archive',
		'yozo/test': 'test',
	})

	const dir = {input: 'src', output: 'dist'}
	const markdownTemplateEngine = false
	return {dir, markdownTemplateEngine}
}
