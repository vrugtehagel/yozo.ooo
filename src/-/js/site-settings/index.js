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
