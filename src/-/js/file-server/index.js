import '/-/js/service-worker/index.js'
import { injectHtml } from './inject-html.js'

const {live, when} = self.yozo

const channel = new BroadcastChannel('file-server')
const files = new Map

when(channel).messages().then(event => {
	if(event.data.type == 'listen') return $state.listening = false
	if(event.data.type != 'filerequest') return
	if(!$state.listening) return
	const {src, uuid} = event.data
	const body = files.get(src) ?? null
	channel.postMessage({body, uuid})
})

export const $state = live({listening: false})

export function listen(){
	channel.postMessage({type: 'listen'})
	$state.listening = true
}

export function extension(src = ''){
	if(!src.includes('.')) return ''
	const extension = src.split('.').at(-1)
	if(/\W/.test(extension)) return ''
	return extension
}

export function upload({ src, body }, { inject } = {}){
	if(inject) body = injectHtml(body, inject)
	files.set(src, body)
}

export function clear(scope){
	for(const [src] of files)
		if(src.startsWith(scope)) files.delete(src)
}
