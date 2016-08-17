import React, {PropTypes} from 'react'
import _ from 'underscore'
import styles from './PagingReader.less'

const getPaperWidth = () => Math.min(window.innerWidth, 800)
const getPaperHeight = () => window.innerHeight - 2 * 20

const PagingReader = React.createClass({
	getIntialState() {
		return {
			content: this.parseContent(),
		}
	},

	componentDidMount() {
		// prevent scroll by suppressing wheel event
		this.refs._container.addEventListener('wheel', (evt) => {
			evt.stopImmediatePropagation()
			evt.preventDefault()
			evt.returnValue = false
		})
	},

	/**
	 * Extraction article content from DOM tree
	 * @return {
	 *     headline: "", 
	 *     standfirst: "", 
	 *     content: [{
	 *     		type: "text", 
	 *     		text: "", 
	 *     },{
	 *     		type: "illustration", 
	 *     		text: "", 
	 *     		meta: {
	 *     	 		src: "",	
	 *     	 		width: 0,	
	 *     	 		height: 0,	
	 *     		}, 
	 *     }, ...],
	 * }
	 */
	parseContent(){
		const headline = document.getElementsByClassName("content__headline")[0].textContent.replace(/^\s+|\s+$/g, '')
		const standfirst = document.getElementsByClassName("content__standfirst")[0].textContent.replace(/^\s+|\s+$/g, '')

		// Extraction main content
		const articleNode = document.getElementsByClassName("content__main-column--article")[0]
		const content = []

		_.map(articleNode.children, (para) => {
			if (para.nodeName === "DIV" && para.style.display !== 'none') {
				// parse text block
				_.each(para.children, v => {
					console.log(v)
					if (v.nodeName === 'P') {
						content.push({
							type: 'text',
							constent: v.textContent,
						})
					}
				})
			} else if (para.nodeName === "FIGURE") {
				const meta = {}
				_.each(para.children, v => {
					if (v.nodeName === "META") {
						meta[v.getAttribute('itemprop')] = v.getAttribute('content')
					}
				})

				// parse illustration block
				content.push({
					type: 'illustration',
					text: para.textContent.replace(/^\s+|\s+$/g, ''),
					meta,
				})
			}
		})

		return {
			headline,
			standfirst,
			content,
		}
	},

	render(){
		return (
			<div style={{
					width: window.innerWidth,
					height: window.innerHeight,
					top: document.body.scrollTop,
				}}
				className={styles.container}
				ref="_container"
			>
				<div className={styles.paper}
					style={{width: getPaperWidth(),
						height: getPaperHeight(),
					}}
				>
								
				</div>
			</div>
		)
	}
})

export default PagingReader