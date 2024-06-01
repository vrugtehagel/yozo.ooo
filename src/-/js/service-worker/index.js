const {when} = self.yozo

async function register(){
	if(!navigator.serviceWorker) return false
	const options = {updateViaCache: 'none'}
	const url = '/service-worker.js'
	const promise = navigator.serviceWorker.register(url, options)
	const [{status, value}] = await Promise.allSettled([promise])
	if(status == 'rejected') return false
	const registration = await navigator.serviceWorker.ready
	if(navigator.serviceWorker.controller) return true
	const message = {type: 'forceactivate'}
	await when(navigator.serviceWorker).controllerchanges().once()
		.after(() => registration.active.postMessage(message))
	return true
}

const success = await register()
export const disabled = !success
