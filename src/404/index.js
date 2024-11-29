import { search } from '/-/js/site-search/index.js'

const path = window.location.href.replace(window.origin, '')
const decoded = decodeURIComponent(path)
const query = decoded.replaceAll(/\W+/g, ' ')

const results = (await search(query))
	.slice(0, 3)

function getIcon(url){
	if(url.startsWith('/docs/')) return 'book'
	if(url.startsWith('/blog/')) return 'chat'
	if(url.startsWith('/tour/')) return 'learn'
	if(url.startsWith('/play/')) return 'controller'
	if(url.startsWith('/download/')) return 'download'
}

const ul = document.querySelector('#guess ul')
for(const result of results){
	const urlText = result.url.split('/').slice(1, -1).join(' › ')
	const icon = getIcon(result.url)
	const li = document.createElement('li')
	li.innerHTML = `
		<a>
			<span class=title>
				${ icon ? `<ui-icon type="${icon}"></ui-icon>` : '' }
			</span>
			<span class=url></span>
		</a>
	`
	li.querySelector('a').href = result.url
	li.querySelector('.title').append(result.title)
	li.querySelector('.url').append(urlText)
	ul.append(li)
}

if(results.length > 0){
	const section = document.querySelector('#guess')
	section.hidden = false
}
