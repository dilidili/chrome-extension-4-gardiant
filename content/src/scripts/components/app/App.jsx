import React, {Component} from 'react'
import {connect} from 'react-redux'
import clickTranslator from '../../clickTranslator'
import _ from 'underscore'
import styles from './App.less'
import {VelocityTransitionGroup} from 'velocity-react'
import {TransitionMotion, spring, presets} from 'react-motion'
import tooltipLayoutComputer from './tooltipLayoutComputer'

const tooltipEnterAnimation = {
  animation: {
    opacity: 1,
    scale: [1, 0],
  },
  duration: 300,
}
const tooltipLeaveAnimation = {
  animation: {
    opacity: 0,
  },
  duration: 300,
}

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      tooltipLayouts: [],
    }
  }
  componentDidMount() {
    this._unsubscribe = clickTranslator.subscribe(document, this.handleWordClicked.bind(this))
  }
  componentWillUnmount() {
    this._unsubscribe && this._unsubscribe()
  }

  // Handler
  handleWordClicked(boundingClientRect, text) {
    if (typeof text === "string" && text.length > 0) {
      const tooltipLayout = tooltipLayoutComputer.tooltipLayoutComputer(boundingClientRect)
      this.setState({
        tooltipLayouts: [tooltipLayout],
      })
    }
  }
  willLeave() {
    return {
      opacity: spring(0),
      scale: 1,
    }
  }
  willEnter() {
    return {
      opacity: 0,
      scale: 0,
    }
  }

  // Render
  render() {
    const {
      tooltipLayouts
    } = this.state

    return (
      <TransitionMotion
        willLeave={this.willLeave}
        willEnter={this.willEnter}
        styles={tooltipLayouts.map(tooltipLayout=>({
          key: tooltipLayout.key, 
          style: {
            scale: spring(1, presets.wobbly),  
            opacity: spring(1),
          },
          data: tooltipLayout,
        }))}
      >
        {
          interpolatedStyles => 
            <div>
              {interpolatedStyles.map(config=>{
                  const tooltipStyle = tooltipLayoutComputer.getTooltipStyle(config)
                  return (
                    <div key={config.key} className={styles.tooltip} style={tooltipStyle.content}>
                      <span className={styles.tri} style={tooltipStyle.tri}/>
                    </div>
                  )
                })
              }
            </div>
        } 
      </TransitionMotion>
    )
  }
}

const mapStateToProps = (state) => {
  return {
  }
}

export default connect(mapStateToProps)(App)
