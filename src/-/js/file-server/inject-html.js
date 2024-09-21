// insert some stuff into the head of an HTML string
// This is not as easy as just DOMParser + XMLSerializer,
// because the latter escapes characters even in style and script tags
// So, regexes it is :/

const doctype = /^<!DOCTYPE +html[^>]*>/i
const comment = /^<!--[^]*?-->/
const openTag = /^<([a-z]+)\s*(?:[^>]*(["'])[^]*?\2)*[^"']*?>/i

export function injectHtml(html, injection){
	const remainder = consumeUntilHead(html)
	if(remainder == null) return html
	const index = html.length - remainder.length
	return html.slice(0, index) + injection + html.slice(index)
}

function consumeUntilHead(string){
	const original = string
	string = consumeComments(string)
	string = consumeDoctype(string)
	string = consumeComments(string)
	string = consumeTag('html', string)
	string = consumeComments(string)
	string = consumeTag('head', string)
	if(string == '') return ''
	if(string != original) return string
	if(openTag.test(string)) return string
	return null
}

function consumeDoctype(string){
	return string.trimStart().replace(doctype, '')
}

function consumeTag(tag, string){
	string = string.trimStart()
	const match = string.match(openTag)
	if(!match) return string
	const [full, name] = match
	if(name.toLowerCase() != tag) return string
	return string.slice(full.length)
}

function consumeComments(string){
	string = string.trimStart()
	for(let length; length > string.length; length = string.length)
		string = string.replace(comment, '').trimStart()
	return string
}
