import React, {PropTypes} from 'react'
import _ from 'underscore'
import styles from './PagingReader.less'
import measureText from '../../measureText'
import FontFace from '../../FontFace'

const getPaperWidth = () => Math.min(window.innerWidth, 800)
const getTextContentWidth = () => getPaperWidth() - 40
const getPaperHeight = () => window.innerHeight - 2 * 20

const HEADLINE_STYLE = [FontFace('Helvetica, sans-serif', null, {weight: 700}), 32, 32*1.04]
const STANDFIRST_STYLE = [FontFace('Helvetica, sans-serif', null, {weight: 300}), 23, 23*1.22]
const CONTENT_STYLE = [FontFace('Helvetica, sans-serif', null, {weight: 400}), 18, 18*1.5]
const ILLUSTRATION_STYLE = [FontFace('Helvetica, sans-serif', null, {weight: 300}), 14, 14*1.5]

const PagingReader = React.createClass({
	getInitialState() {
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
		// Extraction main content
		const articleNode = document.getElementsByClassName("content__main-column--article")[0]
		const content = []

		_.map(articleNode.children, (para) => {
			if (para.nodeName === "DIV" && para.style.display !== 'none') {
				// parse text block
				_.each(para.children, v => {
					if (v.nodeName === 'P') {
						content.push({
							type: 'text',
							constent: v.textContent,
							metric: measureText(v.textContent, getTextContentWidth(), ...CONTENT_STYLE)
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
				const text = para.textContent.replace(/^\s+|\s+$/g, '')
				content.push({
					type: 'illustration',
					text,
					src: meta.url,
					metric: {
						text: measureText(text, getTextContentWidth(), ...ILLUSTRATION_STYLE),
						illustration: {
							width: getTextContentWidth(),
							height: getTextContentWidth() * parseFloat(meta.height) / parseFloat(meta.width),
						},
					},
				})
			}
		})

		const headline = document.getElementsByClassName("content__headline")[0].textContent.replace(/^\s+|\s+$/g, '')
		const standfirst = document.getElementsByClassName("content__standfirst")[0].textContent.replace(/^\s+|\s+$/g, '')
		return {
			headline: {
				text: headline,
				metric: measureText(headline, getTextContentWidth(), ...HEADLINE_STYLE),
			},
			standfirst: {
				text: standfirst,
				metric: measureText(standfirst, getTextContentWidth(), ...STANDFIRST_STYLE),
			},
			content,
		}
	},

	render(){
		console.log(this.state)

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