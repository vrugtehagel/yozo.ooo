import * as fs from 'node:fs/promises'

const recursive = true
const withFileTypes = true
const dirents = await fs.readdir('yozo/test', { recursive, withFileTypes })
const files = dirents.filter(dirent => dirent.isFile())
const jsFiles = files.filter(file => file.name.endsWith('.js'))
const componentPaths = files
	.filter(file => file.name.endsWith('.yz'))
	.map(file => `${file.parentPath.replace('yozo/', '')}/${file.name}`)

const suites = new Map()
for(const file of jsFiles){
	const suite = file.parentPath.replace('yozo/', '')
	const filename = file.name
	const jsPath = `${suite}/${file.name}`
	const componentPath = jsPath.replace(/\.js$/, '.yz')
	const hasComponent = componentPaths.includes(componentPath)
	const tests = suites.get(suite) ?? []
	tests.push({ filename, hasComponent })
	suites.set(suite, tests)
}

export default [...suites].map(([path, tests]) => ({ path, tests }))
