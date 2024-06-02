if(!URL.canParse) await safeImport('/-/js/polyfills/index.js')
const {when} = yozo


export class IFrameBrowser extends EventTarget {
	#iframe
	#src = 'about:blank'
	#valid = true

	get iframe(){ return this.#iframe }
	get valid(){ return this.#valid }
	get sameOrigin(){
		if(!URL.canParse(this.#src)) return false
		const url = new URL(this.#src)
		return url.origin == window.location.origin
	}

	constructor(iframe){
		super()
		this.#iframe = iframe
	}

	async go(src){
		this.#valid = true
		const isBlank = originalSrc == 'about:blank'
		const src = this.#normalize(originalSrc)
		if(!isBlank && src == 'about:blank') return this.#invalid()
		await when(this.#iframe).loads().once().after(() => this.#setSrc(src))
		this.dispatchEvent(new CustomEvent('complete'))
	}

	cancel(){
		if(this.sameOrigin) this.#iframe.contentWindow?.stop()
		else this.#iframe.src = 'about:blank'
		this.dispatchEvent(new CustomEvent('complete'))
	}

	reload(){
		this.go(this.#src)
	}

	#normalize(src){
		src = src.trim()
		if(!src) return 'about:blank'
		if(src.startsWith('/')) src = `${window.location.origin}${src}`
		if(!src.match(/^https?:\/\//)) src = `https://${src}`
		try { src = new URL(src).href }
		catch { src = 'about:blank' }
		return src
	}

	#setSrc(src){
		this.#iframe.src = src
		this.#src = src
		this.dispatchEvent(new CustomEvent('navigate', {detail: {src}}))
	}

	#invalid(){
		this.#valid = false
		this.dispatchEvent(new CustomEvent('error'))
	}

}
