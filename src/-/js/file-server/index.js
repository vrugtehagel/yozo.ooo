import '/-/js/service-worker/index.js'
import { ContextMessenger } from '/-/js/context-messenger/index.js'

const {live, when} = self.yozo

const messenger = new ContextMessenger('file-server')
const files = new Map

when(messenger).listens().then(() => $state.listening = false)
when(messenger).filerequests().then(event => {
	const {src} = event.detail.payload
	const body = files.get(src)
	event.detail.respond(body ?? null)
})

export const $state = live({listening: false})

export function listen(){
	messenger.send('listen')
	$state.listening = true
}

export function extension(src = ''){
	if(!src.includes('.')) return ''
	const extension = src.split('.').at(-1)
	if(/\W/.test(extension)) return ''
	return extension
}

export function upload(...entries){
	for(const {src, body} of entries) files.set(src, body)
}

export function clear(scope){
	for(const [src] of files)
		if(src.startsWith(scope)) files.delete(src)
}
