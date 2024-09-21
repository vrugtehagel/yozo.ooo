let messenger
let print
const loading = Promise.all([
	import('/-/js/context-messenger/index.js'),
	import('/-/js/pretty-print/index.js')
]).then(([{ContextMessenger}, {prettyPrint}]) => {
	print = thing => prettyPrint(thing, 2)
	messenger = new ContextMessenger(window.parent)
})

window.onerror = (event, source, line, column, error) => {
	sendError(source, line, column, error)
	return true
}

window.addEventListener('unhandledrejection', async event => {
	event.preventDefault()
	await loading
	const {message} = event.reason
	await messenger.send('error', {message})
})

async function sendError(source, line, column, error){
	await loading
	const message = error.message ?? `${error}`
	const url = new URL(source, location.origin)
	const src = url.pathname
	await messenger.send('error', {src, line, column, message})
}

const {log} = console
console.log = (...args) => {
	log.apply(console, args)
	loading.then(() => {
		const message = args.map(arg => print(arg)).join(' ')
		messenger.send('log', {message})
	})
}

window.ping = () => {
	loading.then(() => messenger.send('ping'))
}
window.pong = () => {
	loading.then(() => messenger.send('pong'))
}
