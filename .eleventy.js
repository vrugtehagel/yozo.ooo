import { EleventyRenderPlugin } from '@11ty/eleventy'
import EleventyDocumentOutline from '@vrugtehagel/eleventy-document-outline'
import EleventyAssetHash from '@vrugtehagel/eleventy-asset-hash'
import { customMarkdown } from './plugins/custom-markdown.js'

export const config = {
	dir: {input: 'src', output: 'dist'},
	markdownTemplateEngine: false
}

export default function(config){
	config.setFrontMatterParsingOptions({language: 'json'})
	config.setLayoutResolution(false)
	config.setLiquidOptions({extname: ''})
	config.addPlugin(customMarkdown)
	config.addPlugin(EleventyRenderPlugin)
	config.addPlugin(EleventyDocumentOutline, {headers: 'h1, h2, h3'})
	config.addPlugin(EleventyAssetHash, {
		maxLength: 10,
		include: ['**/*.{html,css,js,yz}'],
		exclude: ['/archive/*', '/lib-latest.js', '/dev-latest.js'],
		includeAssets: ['**/*.{css,js,svg}'],
		excludeAssets: ['/archive/*', '/lib-latest.js', '/dev-latest.js'],
	})

	config.addFilter('jsonparse', function(value){
		return JSON.parse(value)
	})
	config.addFilter('remove_icode', function(value){
		return value?.replaceAll(/(`+)( ?)((?:(?!\1).)*?)\2\1{(\w+)}/g, '$3')
	})

	config.addPassthroughCopy('src/{,!(_)**/}*.{css,js,yz,svg,woff2,png,ico,txt,json}')

	config.addWatchTarget('yozo/latest/')
	config.addPassthroughCopy({
		'yozo/versions.json': 'versions.json',
		'yozo/archive': 'archive',
		'yozo/test': 'docs',
		'yozo/latest/lib.js': 'lib-latest.js',
		'yozo/latest/dev.js': 'dev-latest.js',
	})
}
