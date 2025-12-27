---
{
	"title": "Booting up",
	"description": "Need some help getting up and running with Yozo? Follow this step-by-step guide to get started and to get comfortable using Yozo.",
	"terms": "start tutorial booting up load use help setup script tag lib dev"
}
---

<script>
window.steps = [{
	objective: 'Create a new file, "index.html"',
	description: 'First things first; let\'s start a new project. We begin with adding an HTML file for our first page.',
	panes: [{
		type: 'picker',
		allowAdding: true,
		files: []
	}],
	test: files => files.has('index.html')
}, {
	objective: 'Download the dev and lib bundles for Yozo',
	description: 'Next, we\'ll need to download the bundles for Yozo. The development bundle has better error and warning messages, but is also bigger because of it. So; for development, we\'ll use the dev bundle, and on production we should use the smaller lib bundle.'
	panes: [{
		type: 'picker',
		files: [{
			src: 'index.html',
			body: `<!DOCTYPE html>
				…
			`
		}]
	}],
	test: files => {
		return files.has('yozo-lib.js') && files.has('yozo-dev.js')
	}
}]

</script>

