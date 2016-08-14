import _ from 'underscore'

const decorators = [{
	// remove sticky top banner ad
	strategy: (doc) => {
		const targets = doc.body.getElementsByClassName("sticky-top-banner-ad")

		for (var i = targets.length - 1; i >= 0; i--) {
			const target = targets[i]
			target.style.display = 'none'

			// remove the top margin area of the below node
			let nextNode = target.nextSibling
			while (nextNode) {
				if (nextNode.style && nextNode.style.marginTop === target.style.height) {
					nextNode.marginTop = '0px'
				}
				nextNode = nextNode.nextSibling
			}
		}
	},
}, {
	// remove sidebar ad slot
	strategy: (doc) => {
		const targets = doc.querySelectorAll(".ad-slot-container, .js-ad-slot")

		for (var i = targets.length - 1; i >= 0; i--) {
			const target = targets[i]
			target.style.display = 'none'
		}
	},
}]

/**
 * Remove those ad-nodes from the document.body.
 * 
 * @return {void}
 */
export default (function adBlocker() {
	return () => {
		document.body.addEventListener("DOMNodeInserted", function (ev) {
			_.each(decorators, (decorator) => {
				decorator.strategy(document)
			})
		}, false);
	}
})()