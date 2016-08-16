/**
 * Adds a dbclick ation listener, {cb} will be called at any time user double clicks on any word.
 *
 * @param  {DOMNode} node
 * @param  {Function} onPupup
 * @param  {Function} onClose
 * @return {Function} A function to remove dbclick action listener on node
 */
const subscribe = (node, onPupup, onClose) => {
	// double click events will trigger the searching action
	const onDoubleClick = (evt) => {
		const selection = window.getSelection()
		if (selection) {
			const text = selection.toString()
			const oRange = selection.getRangeAt(0)

			onPupup && onPupup(oRange.getBoundingClientRect(), text)
		}
	}
	node.addEventListener('dblclick', onDoubleClick)

	// click or scroll outside the popup window will close the popup window.
	const handleClose = (evt) => {
		onClose && onClose()
	}
	node.addEventListener('click', handleClose)
	node.addEventListener('scroll', handleClose)
	window.addEventListener('resize', handleClose)

	return () => {
		node.removeEventListener('dblclick', onDoubleClick)
		node.removeEventListener('click', handleClose)
		node.removeEventListener('scroll', handleClose)
		window.removeEventListener('resize', handleClose)
	}
}

export default {
	subscribe,
}