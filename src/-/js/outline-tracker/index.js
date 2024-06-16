const {when} = self.yozo

const outline = document.querySelector('nav#outline')
const anchors = outline.querySelectorAll('a[href^="#"]')

const inView = new Set
for(const anchor of anchors){
	const href = new URL(anchor.href).hash
	const header = document.querySelector(href)
	if(!header) continue
	const rootMargin = '-90px 0px -50%' // scroll-padding is 6rem (96px)
	const threshold = 1
	const options = {rootMargin, threshold}
	let firstTrigger = true
	when(header).observes('intersection', options).then(([entry]) => {
		const {isIntersecting} = entry
		const {y} = entry.boundingClientRect
		const intersectsAtTop = y < 100
		if(isIntersecting) inView.add(anchor)
		else inView.delete(anchor)
		if(firstTrigger) return firstTrigger = false
		if(isIntersecting && !intersectsAtTop && inView.size != 1) return
		if(!isIntersecting && !intersectsAtTop && inView.size > 0) return
		outline.querySelector('.current')?.classList.remove('current')
		if(isIntersecting) return anchor.classList.add('current')
		if(!intersectsAtTop)
			return anchor.previousElementSibling?.classList.add('current')
		if(inView.size == 0) return anchor.classList.add('current')
		return anchor.nextElementSibling.classList.add('current')
	})
}
