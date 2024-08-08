import { ContextMessenger } from '/-/js/context-messenger/index.js'

const response = await fetch('/-/data/search.json')
const db = await response.json()

const messenger = new ContextMessenger(self)

function overlaps(target, term){
	return term.includes(target) || target.includes(term)
}

function scorePageAgainstTarget(page, target){
	const {title, terms, url} = page
	let score = 0
	if(title.includes(target))
		score += 15 - .5 * Math.min(20, title.length - target.length)
	else if(url.includes(target))
		score += 15 - .5 * Math.min(20, url.length - target.length)
	score += terms
		.split(' ')
		.map((term, index) => overlaps(target, term) ? index : -1)
		.filter(index => index >= 0)
		.map(index => Math.max(6 - 2 * index, 1))
		.reduce((accumulator, current) => accumulator + current, 0)
	return score
}

function scorePage(page, targets){
	const score = targets
		.map(target => scorePageAgainstTarget(page, target))
		.reduce((accumulator, current) => accumulator + current, 0)
	return score
}

messenger.respondTo('search', ({query}) => {
	const targets = query
		.toLowerCase()
		.split(/[^\w$]+/g)
		.filter(target => target != '')
	const results = db
		.map(page => [scorePage(page, targets), page])
		.sort(([scoreA], [scoreB]) => scoreB - scoreA)
		.filter(([score]) => score > 0)
		.slice(0, 5)
		.map(([score, {title, url}]) => ({title, url, score}))
	return results
})
