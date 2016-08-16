import React, {PropTypes} from 'react'
import _ from 'underscore'
import styles from './PagingReader.less'

const PagingReader = React.createClass({
	componentDidMount(){
		// prevent scroll by suppressing wheel event
		this.refs._container.addEventListener('wheel', (evt) => {
			evt.stopImmediatePropagation()
			evt.preventDefault()
			evt.returnValue = false
		})
	},

	render(){
		return <div 
			style={{
				width: window.innerWidth,
				height: window.innerHeight,
				top: document.body.scrollTop,
			}}
			className={styles.container}
			ref="_container"
		>
		</div>
	}
})

export default PagingReader