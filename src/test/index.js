const {when, timeout} = self.yozo

const icons = document.querySelectorAll('ul li ui-icon')
const runAll = document.querySelector('#run-all ui-button')
const summary = document.querySelector('#summary')
const progress = document.querySelector('#progress')
const message = document.querySelector('#message')
const logs = document.querySelector('#logs')
const output = document.querySelector('#output')

when(runAll).clicks().then(async () => {
	runAll.remove()
	summary.hidden = false
	await customElements.whenDefined('ui-icon')
	let done = 0
	const fails = []
	const total = icons.length
	for(const icon of icons){
		const li = icon.closest('li')
		const testRunner = li.querySelector('test-runner')
		await customElements.whenDefined('ui-icon')
		icon.type = 'spinner'
		const results = await testRunner.run()
		icon.type = results.status
		done++
		const failed = Object.entries(results.statuses)
			.filter(([filename, status]) => status != 'success')
			.map(([filename]) => filename)
		fails.push(...failed)
		progress.textContent = `${Math.floor(done / total * 100)}%`
		await timeout(200)
	}
	const icon = document.querySelector('#summary ui-icon')
	icon.type = fails.length > 0 ? 'fail' : 'success'
	if(fails.length == 0) return message.textContent = 'All tests passed.'
	message.textContent = fails.length == 1
		? 'One test failed!'
		: `${fails.length} tests failed!`
	const readableFails = fails.map(filename => `\n  ${filename}`)
	const failList = `Failing (${fails.length}):${readableFails.join('')}`
	const stats = ['oscpu', 'userAgent', 'platform']
	const info = stats.map(stat => `\n  ${stat}: ${navigator[stat]}`)
	output.textContent = `${failList}\nInfo:${info.join('')}`
	logs.hidden = false
})
