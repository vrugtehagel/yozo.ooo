if (!Promise.withResolvers){
	function withResolvers(){
		let resolve, reject
		const promise = new this((...args) => [resolve, reject] = args)
		return {promise, resolve, reject}
	}
	const configurable = true
	const writable = true
	const value = withResolvers
	const descriptor = {value, writable, configurable}
	Object.defineProperty(Promise, 'withResolvers', descriptor)
}
