import { search } from '/-/js/site-search/index.js'

const path = window.location.href.replace(window.origin, '')
const decoded = decodeURIComponent(path)
const query = decoded.replaceAll(/\W+/g, ' ')

const results = (await search(query)).slice(0, 3)

const wrapper = document.querySelector('#transition-wrapper')
const ul = document.querySelector('#guess ul')
for(const {url, title, icon} of results){
	const urlText = url.split('/').slice(1, -1).join(' › ')
	const li = document.createElement('li')
	li.innerHTML = `
		<a>
			<span class=title>
				${ icon ? `<ui-icon type="${icon}"></ui-icon>` : '' }
			</span>
			<span class=url></span>
		</a>
	`
	li.querySelector('a').href = url
	li.querySelector('.title').append(title)
	li.querySelector('.url').append(urlText)
	ul.append(li)
}

if(results.length > 0){
	const {paint, when} = self.yozo
	const wrapper = document.querySelector('#transition-wrapper')
	const guess = document.querySelector('#guess')

	await yozo.timeout(300)
	wrapper.style.height = '0px'
	wrapper.hidden = false
	await paint()
	wrapper.style.height = guess.offsetHeight + 'px'
	await when(wrapper).transitionends()
		.if(({target}) => target == wrapper)
		.once()
	wrapper.replaceWith(guess)
	await paint()
	guess.hidden = false
}
