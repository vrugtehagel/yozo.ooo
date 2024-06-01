const {live, when} = self.yozo

const $state = live({})
self.$storage = $state


export function linkLocal(namespace, defaults){
	return link(localStorage, namespace, defaults)
}

export function linkSession(namespace, defaults){
	return link(sessionStorage, namespace, defaults)
}

function link(storage, namespace, defaults) {
	const $namespace = $storage[`$${namespace}`]
	if(!live.get($namespace)) live.set($namespace, {})
	for(const [name, fallback] of Object.entries(defaults)){
		linkSingle(storage, namespace, name, fallback)
	}
	return $namespace
}

function linkSingle(storage, namespace, name, fallback) {
	const key = `storage.${namespace}.${name}`
	const stored = storage.getItem(key)
	const type = typeof fallback
	const parse = parsers[type]
	const stringify = stringifiers[type]
	if(stored == null) storage.setItem(key, stringify(fallback))
	const get = () => parse(storage.getItem(key))
	const set = value => storage.setItem(key, stringify(value))
	const changes = when(window).storages().if((event) => event.key == key)
	const $live = $storage[`$${namespace}`][`$${name}`]
	live.link($live, {get, set, changes})
	if(type != 'object') return
	when($live).deepchanges().throttle(500)
		.then(() => storage.setItem(key, stringify(live.get($live))))
}

const parsers = {
	boolean: value => value == 'true',
	string: value => value,
	number: value => Number(value),
	object: value => JSON.parse(value),
}

const stringifiers = {
	boolean: value => value.toString(),
	string: value => value,
	number: value => value.toString(),
	object: value => JSON.stringify(value),
}
