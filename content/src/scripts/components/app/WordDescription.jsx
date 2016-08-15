import React, {PropTypes} from 'react'
import {TransitionMotion, spring} from 'react-motion'
import styles from './WordDescription.less'

const WordDescription = React.createClass({
	propTypes: {
		// refet to ../App.jsx component state
		searchState: PropTypes.number.isRequired,
		searchResult: PropTypes.object,
	},

	// Render
	renderDefinition(){
		const content = this.props.searchResult

		return <div className={styles.definition}>
			{/* Simplified Chinese */}
			<div className={styles.separator}>
				<span className={styles.text}>Simplified Chinese - English</span>
				<span className={styles.line}></span>
			</div>

			<div className={styles.phoneticSymbol}>{content.content}<span className={styles.symbol}>{`|${content.pron}|`}</span></div>	

		</div>
	},
	renderContent(){
		switch (this.props.searchState) {
			case 0:
				return null	
			case 1:
				return <div>正在搜索...</div>	
			case 2:
				return this.renderDefinition() 
			case 3:
				return <div>网络未连接</div>
			case 4:
				return <div>没有查询到结果</div>
			default:
				return <div>Error...</div>	
		}
	},
	render(){
		return <div className={styles.container}>
			{this.renderContent()}
		</div>
	},
})

export default WordDescription