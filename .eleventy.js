import { EleventyRenderPlugin } from '@11ty/eleventy'
import { customMarkdown } from './plugins/custom-markdown.js'

export const config = {
	dir: {input: 'src', output: 'dist'},
	markdownTemplateEngine: false
}

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
		return value?.replaceAll(/(`+)( ?)((?:(?!\1).)*?)\2\1{(\w+)}/g, '$3')
	})

	config.addPassthroughCopy('src/-/**/*.{css,js,yz,svg,woff2,png,ico,txt,json}')
	config.addPassthroughCopy('src/*.{js,ico,svg}')
	config.addPassthroughCopy('src/**/index.{css,js}')

	config.addWatchTarget('yozo/latest/')
	config.addPassthroughCopy({
		'yozo/versions.json': 'versions.json',
		'yozo/archive': 'archive',
		'yozo/test': 'docs',
		'yozo/latest/lib.js': 'lib-latest.js',
		'yozo/latest/dev.js': 'dev-latest.js',
	})
}
