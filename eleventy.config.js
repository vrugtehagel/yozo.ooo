import {VentoPlugin} from 'eleventy-plugin-vento'
import {EleventyRenderPlugin} from '@11ty/eleventy'
import {EleventyDocumentOutline} from '@vrugtehagel/document-outline'
import {assetHash} from '@vrugtehagel/asset-hash'
import {md} from './markdown.config.js'

export default function(config){
	config.setInputDirectory('src')
	config.setOutputDirectory('dist')
	config.setFrontMatterParsingOptions({language: 'json'})
	config.setLayoutResolution(false)
	config.setLibrary('md', md)
	config.addPlugin(EleventyRenderPlugin)
	config.addPlugin(EleventyDocumentOutline)
	config.addPlugin(VentoPlugin, {ventoOptions: {strict: true}})
	config.on('eleventy.after', ({directories}) => assetHash({
		cwd: directories.output,
		scan: ['**/*.{html,css,js,yz}'],
		noscan: ['/archive/*', '/lib-latest.js', '/dev-latest.js'],
		hash: ['**/*.{css,js,svg,json}'],
		nohash: ['/archive/*', '/lib-latest.js', '/dev-latest.js'],
	}))

	config.addPairedShortcode('markdown', md.render.bind(md))
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
