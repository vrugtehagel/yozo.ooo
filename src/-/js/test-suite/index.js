import { ContextMessenger } from '/-/js/context-messenger/index.js'

const {when, live} = window.yozo

export class TestSuite {
	#path = null
	#filenames = []
	#sandbox = document.createElement('iframe')
	#messenger = null
	#needsReload = true
	#loadedOnce = false
	$state = live({})

	get #window(){ return this.#sandbox.contentWindow }
	get iframe(){ return this.#sandbox }

	constructor(path, filenames){
		this.#path = path
		this.#filenames = [...filenames]
		this.$state.statuses = [...filenames].fill('pending')
		live.link(this.$state.$result, () => {
			const {statuses} = this.$state
			if(statuses.every(status => status == 'pending'))
				return 'pending'
			if(statuses.includes('pending')) return 'running'
			if(statuses.includes('running')) return 'running'
			if(statuses.includes('failed')) return 'failed'
			return 'success'
		})
	}

	async #reloadSandbox(isFirstTime){
		const setSrc = !this.#loadedOnce
		this.#loadedOnce = true
		await when(this.#sandbox).loads().once().after(() => {
			if(setSrc) this.#sandbox.src = `${this.#path}/sandbox.html`
			else this.#window.location.reload()
		})
		this.#messenger = new ContextMessenger(this.#window)
		this.#needsReload = false
	}

	async run(){
		for(const index of this.#filenames.keys()) await this.#test(index)
	}

	async #test(index){
		this.$state.$statuses[index] = 'running'
		const filename = this.#filenames[index]
		if(this.#needsReload) await this.#reloadSandbox()
		const response = await this.#messenger.send('run', {filename})
		const {ok, refresh} = response
		if(refresh || !ok) this.#needsReload = true
		this.$state.$statuses[index] = ok ? 'success' : 'failed'
	}
}

