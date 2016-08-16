import React, {PropTypes} from 'react'
import styles from './WordDescription.less'
import _ from 'underscore'
import Audio from './Audio'
import ScrollLockMixin from './ScrollLockMixin'

const WordDescription = React.createClass({
	propTypes: {
		// refet to ../App.jsx component state
		searchState: PropTypes.number.isRequired,
		searchResult: PropTypes.object,
	},
	mixins: [ScrollLockMixin],

	componentDidMount() {
		this.scrollLock()

		// Prevent recursively searching definitions.
		this.refs._container.addEventListener('dblclick', (evt) => {
			evt.stopPropagation()
		})
		// Prevent closing the panel caused by scroll events.
		this.refs._container.addEventListener('scroll', (evt) => {
			evt.stopPropagation()
		})
		// Prevent closing the panel caused by click events.
		this.refs._container.addEventListener('click', (evt) => {
			evt.stopPropagation()
		})
	},

	componentWillUnmount() {
		this.scrollRelease();
	},

	// Render
	renderDefinition(){
		const content = this.props.searchResult
		let en_def_index = 0 // used for recording sequence of content.en_definitions

		return <div className={styles.definition}>
			{/* Simplified Chinese */}
			<div className={styles.separator}>
				<span className={styles.text}>Simplified Chinese - English</span>
				<span className={styles.line}></span>
			</div>
			<div className={styles.phoneticSymbol}>{content.content}<span className={styles.symbol}>{`|${content.pron}|`}</span></div>	
			{
				_.map(content.cn_definition.defn.split('\n'), (def, index)=>{
					def = def.split('.')
					return <div key={index} className={styles.item}>{`${String.fromCharCode(65+index)}. ${def[0]}`}<span className={styles.def}>{def[1]}</span></div>
				})
			}

			{/* English */}
			<div className={styles.separator}>
				<span className={styles.text}>English</span>
				<span className={styles.line}></span>
			</div>
			<div className={styles.phoneticSymbol}>{content.content}<span className={styles.symbol}>{`|${content.pron}|`}</span></div>	
			{
				_.map(content.en_definitions, (val, key, index)=>{
					return (
						<div key={key} style={{marginBottom: '0.2em'}}>
							<div className={styles.item}>{`${String.fromCharCode(65+en_def_index++)}. ${key}`}</div>
							{
								_.map(val, (def, index)=>{
									return <div key={index} style={{marginLeft: '3.5em', color: 'black'}}>{`${String.fromCharCode(9312+index)} ${def}`}</div>
								})
							}
						</div>
					)
				})
			}

			{/* play the audio */}
			<div className={styles.separator}>
				<span className={styles.line}></span>
			</div>
			<div className={styles.audioPanel}>
				<span className={styles.text}>播放读音</span>	
				<Audio className={styles.icon} src={content.audio}></Audio>
			</div>
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
		return <div className={styles.container} ref="_container">
			{this.renderContent()}
		</div>
	},
})

export default WordDescription