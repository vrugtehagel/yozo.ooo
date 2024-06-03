// When refactoring to module, delete this file and just use index.js
(() => {
	self.ContextMessenger = class ContextMessenger {
		#outgoing
		#incoming
		#connecting

		constructor(outgoing, incoming = self) {
			this.#outgoing = outgoing
			this.#incoming = incoming
			this.#connecting = this.#connect()
		}

		async send(type, payload) {
			if(type) await this.#connecting
			const controller = new AbortController()
			const { signal } = controller
			const uuid = crypto.randomUUID()
			const { origin } = window.location
			const { promise, resolve } = Promise.withResolvers()
			this.#incoming.addEventListener(`message`, (event) => {
				if (event.data.uuid == uuid) resolve()
			})
			this.#outgoing.postMessage({ type, uuid, payload }, origin)
			return promise.then(() => controller.abort())
		}

		respondTo(type, handler, options) {
			this.#incoming.addEventListener(`message`, (event) => {
				this.#handleIncoming(event, type, handler)
			}, options)
		}

		#verifySource(source) {
			if (!source) return true
			if (this.#outgoing == source) return true
			if (this.#outgoing instanceof BroadcastChannel) return true
			return false
		}

		async #handleIncoming(event, type, handler) {
			if (event.data.type != type) return
			const verified = this.#verifySource(event.source)
			if (!verified) return
			const response = await handler(event.data.payload)
			const { uuid } = event.data
			const payload = response
			outgoing.postMessage({ type: null, uuid, payload })
		}

		async #connect() {
			if (!Promise.withResolvers) await import(`/-/js/polyfills/index.js`)
			if (this.#outgoing instanceof BroadcastChannel) return
			await `microtask`
			const { promise, resolve } = Promise.withResolvers()
			const controller = new AbortController()
			const { signal } = controller
			this.respondTo(``, resolve, { signal })
			const response = this.send(``)
			await Promise.all([promise, response])
			controller.abort()
		}
	}

})()
