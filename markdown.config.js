import MarkdownIt from 'markdown-it'
import deflist from 'markdown-it-deflist'
import anchor from 'markdown-it-anchor'
import container from 'markdown-it-container'

export const md = MarkdownIt({html: true})

function htmlEscape(html){
	const map = {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}
	return html.replaceAll(/[&<>"]/g, character => map[character])
}

// ```lang
// Use `<ui-code language="…" cancopy>` instead of `<pre>`
md.renderer.rules.fence = (tokens, index) => {
	const token = tokens[index]
	const {content, info} = token
	const escaped = htmlEscape(content)
	return `<ui-code language="${info}" cancopy>${escaped}</ui-code>`
}

// Use `<ui-icode type="…">` instead of `<code>`
md.renderer.rules.typed_code_inline = (tokens, index) => {
	const token = tokens[index]
	const {content, info} = token
	const escaped = htmlEscape(content)
	return `<ui-icode type="${info}">${escaped}</ui-icode>`
}

// Add `{lang}` functionality to inline code
const INLINE_CODE = /^(`+)( ?)((?:(?!\1).)*?)\2\1{(\w+)}/
md.inline.ruler.before('backticks', 'typed_code_inline', (state, silent) => {
	const start = state.pos
	if (silent) return false
	if (state.src[start] != '`') return false
	const match = state.src.slice(start).match(INLINE_CODE)
	if (!match) return false
	const [full, ticks, space, content, type] = match
	const token = state.push('typed_code_inline', 'ui-icode', 0)
	token.markup = `\`${type}\``
	token.attrs = [['type', type]]
	token.content = content
	token.info = type
	state.pos += full.length
	return true
})

// Header permalinks
md.use(deflist)
const permalinkOptions = {symbol: '', placement: 'before'}
const permalink = anchor.permalink.linkInsideHeader(permalinkOptions)
md.use(anchor, {permalink, tabIndex: false})

// `:::type`-style callouts to `<ui-callout type="…">`
// Maybe swap out for GitHub-style callouts?
const renderCallout = (tokens, index) => {
	const {info, nesting} = tokens[index]
	const match = info.trim().match(/^(\S+).*$/)
	if (nesting != 1) return '</ui-callout>\n'
	const [full, type] = match
	return `<ui-callout type="${type}">`
}
md.use(container, 'callout', {validate: () => true, render: renderCallout})
