import { ContextMessenger } from '/-/js/context-messenger/index.js'


const {live} = self.yozo

const url = new URL('./worker.js', import.meta.url)
const worker = new Worker(url, {type: 'module'})
const messenger = new ContextMessenger(worker, worker)

export const $results = live([])

export async function search(query){
	const results = await messenger.send('search', {query})
	live.set($results, results)
}

const mains = [
	// {title: 'Tour', url: '/tour/'},
	{title: 'Documentation', url: '/docs/'},
	{title: 'Playground', url: '/play/'},
	{title: 'Blog', url: '/blog/'},
	{title: 'Download', url: '/download/'},
]

export function showMains(){
	live.set($results, mains)
}

export function clear(){
	live.set($results, [])
}
