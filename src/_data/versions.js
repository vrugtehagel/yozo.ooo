import {readFile} from 'node:fs/promises'

const json = await readFile('yozo/versions.json', 'utf8')
export default JSON.parse(json)
