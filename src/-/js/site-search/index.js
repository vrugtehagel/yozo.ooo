import { ContextMessenger } from '/-/js/context-messenger/index.js'


const url = new URL('./worker.js', import.meta.url)
const worker = new Worker(url, {type: 'module'})
const messenger = new ContextMessenger(worker, worker)

export async function search(query){
	return await messenger.send('search', {query})
}
