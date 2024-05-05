const {when} = self.yozo

const disabled = await navigator.serviceWorker?.register('/service-worker.js', {
	updateViaCache: 'none'
}).then(() => false, () => true) ?? true;

if(!disabled){
	const registration = await navigator.serviceWorker.ready

	if(!navigator.serviceWorker.controller){
		const message = {type: 'forceactivate'}
		await when(navigator.serviceWorker).controllerchanges().once()
			.after(() => registration.active.postMessage(message))
	}
}

export { disabled }
