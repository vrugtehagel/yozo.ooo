import { glob } from 'node:fs/promises'


export default async function(){
	const recursive = true
	const withFileTypes = true
	const dirents = await Array.fromAsync(glob('yozo/test/**/*.{js,yz}'))
	const paths = dirents
		.map(file => file.replace('test/', 'docs/'))
	const jsPaths = paths.filter(path => path.endsWith('.js'))
	const yzPaths = paths.filter(path => path.endsWith('.yz'))

	const suites = new Map()
	for(const jsPath of jsPaths){
		const suite = '/' + jsPath.split('/').slice(1, -1).join('/')
		const filename = jsPath.split('/').at(-1)
		const yzPath = jsPath.replace(/\.js$/, '.yz')
		const hasComponent = yzPaths.includes(yzPath)
		const tests = suites.get(suite) ?? []
		tests.push(hasComponent ? {filename, hasComponent} : {filename})
		suites.set(suite, tests)
	}

	return [...suites].map(([path, tests]) => ({path, tests}))
}
