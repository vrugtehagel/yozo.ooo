const json = await Deno.readTextFile('yozo/versions.json')
export default JSON.parse(json)
