import deflist from 'markdown-it-deflist'
import anchor from 'markdown-it-anchor'
import container from 'markdown-it-container'

export function amendMarkdown(config){
	config.amendLibrary('md', md => amend(md))
}

function amend(md){
	md.renderer.rules.fence = blockCodeRule
	md.renderer.rules.typed_code_inline = inlineCodeRule
	md.inline.ruler.before('backticks', 'typed_code_inline', inlineCodeTokenize)
	md.use(deflist)
	const permalinkOptions = { symbol: '', placement: 'before' }
	const permalink = anchor.permalink.linkInsideHeader(permalinkOptions)
	md.use(anchor, { permalink, tabIndex: false })
	md.use(container, 'callout', { validate: () => true, render: calloutRule })
	return md
}

function blockCodeRule(tokens, index){
	const t = tokens.find(token => token.content == `\`arg\`...targets\`\``)
	const token = tokens[index]
	const { content, info } = token
	const escaped = htmlEscape(content)
	return `<ui-code language="${info}">${escaped}</ui-code>`
}

function inlineCodeRule(tokens, index){
	const token = tokens[index]
	const { content, info } = token
	const escaped = htmlEscape(content)
	return `<ui-icode type="${info}">${escaped}</ui-icode>`
}

function calloutRule(tokens, index){
	const { info, nesting } = tokens[index]
	const match = info.trim().match(/^(\S+).*$/)
	if (nesting != 1) return '</ui-callout>\n';
	const [full, type] = match
	return `<ui-callout type="${type}">`

}

const inlineCodeRegex = /^`(\w+)`([^ `\]].*?)``/
function inlineCodeTokenize(state, silent){
	const start = state.pos
	if (silent) return false
	if (state.src[start] != '`') return false
	const match = state.src.slice(start).match(inlineCodeRegex)
	if (!match) return false
	const [full, type, content] = match
	const token = state.push('typed_code_inline', 'ui-icode', 0)
	token.markup = `\`${type}\``
	token.attrs = [['type', type]]
	token.content = content
	token.info = type
	state.pos += full.length
	return true
}

function htmlEscape(html){
	const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }
	return html.replaceAll(/[&<>"]/g, character => map[character])
}
