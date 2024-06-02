import { $settings } from '/-/js/site-settings/index.js'

export function format(code, language){
	code = trim(code)
	code = formatIndentation(code)
	if(language == 'js') code = formatJS(code)
	if(language == 'mjs') code = formatJS(code)
	if(language == 'html') code = formatHTML(code)
	if(language == 'yz') code = formatHTML(code)
	return code
}

function trim(code){
	return code.replaceAll(/^\s+\n|\n\s+$/g, '')
}

function formatIndentation(code){
	const indent = $settings.indent
	if(indent == '\t') return code
	return code.replaceAll(/^\t+/gm, match => indent.repeat(match.length))
}

function formatJS(code){
	if($settings.semicolons) return code
	const parts = code.split(/(`(?:(?!\${)[^`]|\\`)*`)/g)
	const semicolons = /;(?=\s*?(?:\/\/.*)?$)/gm
	for(let index = 0; index < parts.length; index += 2){
		parts[index] = parts[index].replaceAll(semicolons, '')
	}
	return parts.join('')
}

function formatHTML(code){
	const parts = code.split(/(<script>[^]*?<\/script>)/g)
	for(let index = 1; index < parts.length; index += 2){
		const withoutTags = parts[index].slice(8, -9)
		parts[index] = `<script>${formatJS(withoutTags)}</script>`
	}
	return parts.join('')
}
