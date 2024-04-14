import { EleventyRenderPlugin } from '@11ty/eleventy'
import { customMarkdown } from './plugins/custom-markdown.js'

export default function(config){
	config.setFrontMatterParsingOptions({language: 'json'});
	config.setLayoutResolution(false)
	config.setLiquidOptions({extname: ''})
	config.addPlugin(customMarkdown)
	config.addPlugin(EleventyRenderPlugin)

	config.addFilter('jsonparse', function(value){
		return JSON.parse(value)
	})
	config.addFilter('remove_icode', function(value){
		return value?.replaceAll(/`\w+`([^ `\]].*?)``/g, '$1')
	})

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
