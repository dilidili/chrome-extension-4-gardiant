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
	// just hide other unwanted nodes
	strategy: (doc) => {
		const blockList = ['.ad-slot-container',
			'.js-ad-slot',
			'.js-navigation-header',
			'.content__labels',
			'.content__secondary-column',
			'.js-content-meta',
			'.element-rich-link',
			'.submeta',
			'.content-footer',
			'.l-footer',
			'.site-message',
			'.fsrOverlay',
		]
		const targets = doc.querySelectorAll(blockList.join(', '))

		for (var i = targets.length - 1; i >= 0; i--) {
			const target = targets[i]
			target.style.display = 'none'
		}
	},
}, {
	// horizontally center the article 
	strategy: (doc) => {
		const targets = doc.body.getElementsByClassName("content__main-column")

		for (var i = targets.length - 1; i >= 0; i--) {
			const target = targets[i]
			target.style.marginLeft = 'auto'
			target.style.marginRight = 'auto'
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
		document.body.addEventListener("DOMNodeInserted", function(ev) {
			_.each(decorators, (decorator) => {
				decorator.strategy(document)
			})
		}, false);
	}
})()