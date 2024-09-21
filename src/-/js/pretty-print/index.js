export function prettyPrint(thing, depth = 1){
	if(depth <= 0) return '…'
	const type = typeof thing
	if(type == 'object') return prettyPrintObject(thing, depth)
	if(type == 'function') return prettyPrintFunction(thing)
	return prettyPrintPrimitive(thing)
}

function prettyPrintPrimitive(thing){
	if(typeof thing == 'string') return `"${thing}"`
	if(typeof thing == 'symbol') return thing.toString()
	if(typeof thing == 'bigint') return `${thing}n`
	return `${thing}`
}

function prettyPrintFunction(thing){
	const source = thing.toString()
	const isClass = source.startsWith('class')
	const name = thing.name
	if(isClass) return `class ${name} { … }`
	return `function ${name}(){ … }`
}

function prettyPrintObject(thing, depth){
	if(thing == null) return 'null'
	const unwrapped = window.yozo?.live.get(thing)
	const isLive = window.yozo && unwrapped != thing
	if(isLive) return `Live<${prettyPrint(unwrapped, depth)}>`
	if(Array.isArray(thing)) return prettyPrintArray(thing, depth)
	if(thing instanceof Element) return `<${thing.localName}>`
	const isNode = thing instanceof Node && thing.nodeName
	if(isNode) return `${thing.nodeName}`
	const name = thing.constructor.name
	const isPlain = name == 'Object'
	if(!isPlain) return `${name} { … }`
	const keys = Reflect.ownKeys(thing)
	if(keys.length == 0) return `{}`
	const pairs = keys
		.slice(0, 2)
		.map(key => prettyPrintKeyValue(thing, key, depth - 1))
		.join(', ')
	if(keys.length <= 2) return `{ ${pairs} }`
	return `{ ${pairs}, … }`
}

function prettyPrintArray(thing, depth){
	if(thing.length == 0) return `[]`
	if(depth <= 1) return `[ … ]`
	const items = thing
		.slice(0, 3)
		.map(item => prettyPrint(item, depth - 1))
		.join(', ')
	if(thing.length <= 3) return `[ ${items} ]`
	return `[ ${items}, … ]`
}

function prettyPrintKeyValue(target, property, depth){
	const key = typeof property == 'string' && property.match(/^[a-z]\w+$/i)
		? property
		: prettyPrintPrimitive(property)
	const value = prettyPrint(target[property], depth)
	return `${key}: ${value}`
}
