import {VentoPlugin} from 'eleventy-plugin-vento'
import {EleventyRenderPlugin} from '@11ty/eleventy'
import EleventyDocumentOutline from '@vrugtehagel/eleventy-document-outline'
import EleventyAssetHash from '@vrugtehagel/eleventy-asset-hash'
import {md} from './markdown.config.js'

export default function(config){
	config.setInputDirectory('src')
	config.setOutputDirectory('dist')
	config.setFrontMatterParsingOptions({language: 'json'})
	config.setLayoutResolution(false)
	config.setLiquidOptions({extname: ''})
	config.setLibrary('md', md)
	config.addPlugin(VentoPlugin)
	config.addPlugin(EleventyRenderPlugin)
	config.addPlugin(EleventyDocumentOutline, {headers: 'h1, h2, h3'})
	config.addPlugin(EleventyAssetHash, {
		maxLength: 10,
		include: ['**/*.{html,css,js,yz}'],
		exclude: ['/archive/*', '/lib-latest.js', '/dev-latest.js'],
		includeAssets: ['**/*.{css,js,svg,json}'],
		excludeAssets: ['/archive/*', '/lib-latest.js', '/dev-latest.js'],
	})

	config.addPairedShortcode('markdown', md.render.bind(md))
	config.addFilter('jsonparse', value => JSON.parse(value))
	config.addPassthroughCopy('src/{,!(_)**/}*.{css,js,json}')
	config.addPassthroughCopy('src/**/*.{yz,svg,woff2,png,ico,txt}')
	config.addWatchTarget('yozo/latest/')
	config.addPassthroughCopy({
		'yozo/versions.json': 'versions.json',
		'yozo/archive': 'archive',
		'yozo/test': 'docs',
		'yozo/latest/lib.js': 'lib-latest.js',
		'yozo/latest/dev.js': 'dev-latest.js',
	})
	return {markdownTemplateEngine: false}
}
