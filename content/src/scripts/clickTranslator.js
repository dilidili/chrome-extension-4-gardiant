/**
 * Adds a dbclick ation listener, {cb} will be called at any time user double clicks on any word.
 *
 * @param  {DOMNode} node
 * @param  {Function} cb
 * @return {Function} A function to remove dbclick action listener on node
 */
const subscribe = (node, cb) => {
	// double click events will trigger translate action
	node.ondblclick = function(evt) {
		const selection = window.getSelection()
		if (selection) {
			const text = selection.toString()
			const oRange = selection.getRangeAt(0)

			cb && cb(oRange.getBoundingClientRect())
		}
	}

	return () => {
		node.ondblclick = () => {}
	}
}

export default {
	subscribe,
}