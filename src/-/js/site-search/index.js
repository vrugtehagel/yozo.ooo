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
