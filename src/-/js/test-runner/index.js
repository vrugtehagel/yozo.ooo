import { ContextMessenger } from '/-/js/context-messenger/index.js'

const {when, live} = window.yozo

export class TestRunner {
	$statuses = live({})
	#suite
	#filenames

	constructor(suite, filenames){
		this.#suite = suite
		this.#filenames = filenames
		for(const filename of filenames) this.$statuses[filename] = 'pending'
	}

	async run(){
		const iframe = document.createElement('iframe')
		iframe.classList.add('sr-only')
		document.body.append(iframe)
		await when(iframe).loads().once()
			.after(() => iframe.src = `${this.#suite}/sandbox.html`)
		let messenger = new ContextMessenger(iframe.contentWindow)
		let success = true
		for(const filename of this.#filenames){
			this.$statuses[filename] = 'running'
			const response = await messenger.send('run', {filename})
			const {ok, refresh} = response
			this.$statuses[filename] = ok ? 'success' : 'fail'
			success &&= ok
			if(ok && !refresh) continue
			await when(iframe).loads().once()
				.after(() => iframe.contentWindow.location.reload())
			messenger = new ContextMessenger(iframe.contentWindow)
		}
		iframe.src = 'about:blank'
		iframe.remove()
		return success
	}
}
