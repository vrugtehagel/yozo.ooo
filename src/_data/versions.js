import * as fs from 'node:fs/promises'

const json = await fs.readFile('yozo/versions.json', 'utf8')
export default JSON.parse(json)
