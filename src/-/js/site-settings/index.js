import * as storage from '/-/js/storage/index.js'

const {live, when} = self.yozo

export const $settings = storage.linkLocal('settings', {
	semicolons: true,
	useTabs: true,
	tabSize: 4,
	lineNumbers: true,
	highlightInline: true,
	runTests: false,
	maxCharHighlight: 10_000
})
self.$settings = $settings

live.link($settings.$indent, () => {
	if($settings.useTabs) return '\t'
	return ' '.repeat($settings.tabSize)
})

export function format(code, language){
	code = code.replace(/^\s+\n|\n\s+$/, '')
	const indent = $settings.indent
	if(indent != '\t')
		code = code.replaceAll(/^\t+/gm, match => indent.repeat(match.length))
	if($settings.semicolons) return code
	if(language == 'js') return code.replaceAll(/;(?=\s*?(?:\/\/.*)?$)/gm, '')
	if(!['yz', 'html'].includes(language)) return code
	const semicolonsInsideScripts =
		/;(?=[^\S\n]*(?:\/\/.*)?$)(?=(?:[^](?!<script>))*<\/script>)/gm
	return code.replaceAll(semicolonsInsideScripts, '')
}
