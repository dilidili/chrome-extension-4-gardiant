import React, {PropTypes} from 'react'
import _ from 'underscore'
import styles from './PagingReader.less'
import measureText from '../../measureText'
import FontFace from '../../FontFace'
import {TransitionMotion, spring, presets} from 'react-motion'

const getPaperWidth = () => Math.min(window.innerWidth, 800)
const getPaperHeight = () => window.innerHeight - 2 * 20
const getTextContentWidth = () => getPaperWidth() - 40
const getTextContentHeight = () => getPaperHeight() - 40

const HEADLINE_STYLE = [FontFace('Helvetica, sans-serif', null, {weight: 700}), 30, 30*1.04]
const STANDFIRST_STYLE = [FontFace('Helvetica, sans-serif', null, {weight: 300}), 15, 15*1.1]
const CONTENT_STYLE = [FontFace('Helvetica, sans-serif', null, {weight: 400}), 18, 18*1.3]
const ILLUSTRATION_STYLE = [FontFace('Helvetica, sans-serif', null, {weight: 300}), 14, 14*1.3]

const PagingReader = React.createClass({
	getInitialState() {
		return this.computePagination()	
	},

	componentDidMount() {
		// prevent scroll by suppressing wheel event
		this.refs._container.addEventListener('wheel', (evt) => {
			evt.stopImmediatePropagation()
			evt.preventDefault()
			evt.returnValue = false
		})

		this._updateDimension = _.debounce(this.updateDimensions, 300)
		window.addEventListener("resize", this._updateDimension)
	},
	componentWillUnmount: function() {
		window.removeEventListener("resize", this._updateDimension)
	},

	computePagination() {
		const content = this.parseContent()
		const pagination = this.paginate(content)

		return {
			pagination: pagination,
			currentIndex: 1,
		}
	},
	updateDimensions() {
		this.setState(this.computePagination())
	},

	handleSwitchPage(index){
		this.setState({
			currentIndex: index,
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
						margin: 20,
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
				height: measureText(headline, getTextContentWidth(), ...HEADLINE_STYLE).height + 15,
			},
			standfirst: {
				text: standfirst,
				height: measureText(standfirst, getTextContentWidth(), ...STANDFIRST_STYLE).height + 40,
			},
			content,
		}
	},
	/**
	 * According the frame of page, divide the whole content into different pages.
	 * 
	 * @param  {Object} content
	 * 
	 * @return {Array}
	 */
	paginate(content){
		let key = 0
		const width = getTextContentWidth()
		const height = getTextContentHeight()
		const pages = []
		let currentPage = []
		let currentPageAcc = 0

		// add headline and standfirst.
		currentPage.push(<div key={key++} className={styles.headline} style={{height:content.headline.height}}>{content.headline.text}</div>)
		currentPage.push(<div key={key++} className={styles.standfirst} style={{height:content.standfirst.height}}>{content.standfirst.text}</div>)
		currentPageAcc += (content.headline.height + content.standfirst.height)

		_.each(content.content, v => {
			switch(v.type){
				case 'illustration':
					// maybe squeeze the illustration lightly. 
					const surplus = Math.max(currentPageAcc + v.metric.illustration.height - height, 0)

					if (surplus / height > 0.25) {
						pages.push(currentPage)
						currentPage = []
						currentPageAcc = 0
					}
					currentPage.push(<img key={key++} style={{width, height: v.metric.illustration.height - surplus}} src={v.src}></img>)

					// add notation text
					if (currentPageAcc + v.metric.text.height + v.metric.margin > height) {
						pages.push(currentPage)
						currentPage = []
						currentPageAcc = 0
					}
					currentPage.push(<div key={key++} className={styles.illustrationText} style={{width, height: v.metric.text.height, marginBottom: v.metric.margin}}>{v.text}</div>)
					currentPageAcc += v.metric.text.height + v.metric.illustration.height + v.metric.margin
					break
				case 'text':
					_.map(v.metric.lines, line=>{
						if (currentPageAcc + CONTENT_STYLE[2] > height) {
							pages.push(currentPage)
							currentPage = []
							currentPageAcc = 0
						}
						currentPageAcc += CONTENT_STYLE[2] 
						currentPage.push(<div key={key++} className={styles.line}>{line.text}</div>)	
					})

					// insert line break between paragraphs
					if (currentPageAcc + CONTENT_STYLE[2] > height) {
						pages.push(currentPage)
						currentPage = []
						currentPageAcc = 0
					}
					currentPageAcc += CONTENT_STYLE[2]
					currentPage.push(<div key={key++} className={styles.line} style={{height: CONTENT_STYLE[2], width}}>{' '}</div>)
					break	
				default:
					break	
			}
		})

		pages.push(currentPage)
		return pages
	},

	render(){
		const {
			pagination,
			currentIndex,
		} = this.state

		return (
			<div style={{
					width: window.innerWidth,
					height: window.innerHeight,
					top: document.body.scrollTop,
				}}
				className={styles.container}
				ref="_container"
			>
				{/* render pages of this article */}
				<div className={styles.paper}
					style={{width: getPaperWidth(),
						height: getPaperHeight(),
					}}
				>
					{
						_.map(pagination[currentIndex], v => v)
					}
				</div>

				<PageNavigation handleSwitchPage={this.handleSwitchPage} className={styles.pageNavigation} pageCount={pagination.length} currentPage={currentIndex}></PageNavigation>	
			</div>
		)
	}
})

const EDGE_LENGH = 20
const PageNavigation = React.createClass({
	propTypes: {
		pageCount: PropTypes.number,
		currentPage: PropTypes.number,
		className: PropTypes.string,
		handleSwitchPage: PropTypes.func.isRequired,
	},
	getDefaultProps(){
		return {
			pageCount: 0,
			currentPage: 0,
			className: "",
		}
	},

	willLeave() {
		return {
			scale: spring(0),
		}
	},
	willEnter() {
		return {
			scale: 0,
		}
	},

	render(){
		const {
			pageCount,
			currentPage,
			className,
		} = this.props
		const motionStyles = _.range(pageCount).map(pageIndex => ({
			key: pageIndex,
			style: {
				scale: spring(pageIndex === currentPage ? 1.6 : 1),
			},
		}))

		return (
			<TransitionMotion
				willLeave={this.willLeave}	
				willEnter={this.willEnter}	
				styles={motionStyles}
			>
				{
					interpolatedStyles => 
					<div className={styles.pageNavigation}>
						{interpolatedStyles.map(config=>{
							const edgeLength = EDGE_LENGH * config.style.scale

							return (
								<span onClick={()=>{this.props.handleSwitchPage(config.key)}} className={styles.pageAnchor} key={config.key} style={{width: edgeLength, height: edgeLength, marginLeft: edgeLength*0.2, marginRight: edgeLength*0.2, fontSize: edgeLength*0.5}}>{config.key}</span>
							)
						})}
					</div>
				}	
			</TransitionMotion>
		)
	},	
})

export default PagingReader