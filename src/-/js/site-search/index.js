import { ContextMessenger } from '/-/js/context-messenger/index.js'


const url = new URL('./worker.js', import.meta.url)
const worker = new Worker(url, {type: 'module'})
const messenger = new ContextMessenger(worker, worker)

function getIcon(url){
	if(url.startsWith('/docs/')) return 'book'
	if(url.startsWith('/blog/')) return 'chat'
	if(url.startsWith('/tour/')) return 'learn'
	if(url.startsWith('/play/')) return 'controller'
	if(url.startsWith('/download/')) return 'download'
	return null
}

export async function search(query){
	const results = await messenger.send('search', {query})
	return results.map(({title, url, score}) => {
		const icon = getIcon(url)
		return {title, url, score, icon}
	})
}
