import React, {Component} from 'react'
import {connect} from 'react-redux'
import clickTranslator from '../../clickTranslator'
import _ from 'underscore'

const TOOLTIP_WIDTH = 395
const TOOLTIP_HEIGHT = 200
const TOOLTIP_MARGIN = 12

/**
 * @param {Object} wordBoundingClientRect
 * @return A new boundingClientRect of tooltip indicates resonable postion and width on the current page.
 */
const tooltipLayoutComputer = (wordBoundingClientRect) => {
  const {
    innerWidth: iw,
    innerHeight: ih,
  } = window
  const {
    width: ww,
    height: wh,
    left: wl,
    top: wt,
  } = wordBoundingClientRect
  const [wordCenterLeft, wordCenterTop] = [wl + ww / 2, wt + wh / 2]

  const width = Math.min(iw * 0.8, TOOLTIP_WIDTH)
  const height = TOOLTIP_HEIGHT
  // left is restrained by both sides
  const left = Math.min(Math.max(TOOLTIP_MARGIN, wordCenterLeft - width / 2), iw - TOOLTIP_MARGIN - width)
  const top = wordCenterTop + TOOLTIP_MARGIN

  return {
    width,
    height,
    left,
    top,
  }
}

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      tooltipLayout: null,
    }
  }
  componentDidMount() {
    this._unsubscribe = clickTranslator.subscribe(document, this.handleWordClicked.bind(this))
  }
  componentWillUnmount() {
    this._unsubscribe && this._unsubscribe()
  }

  // Handler
  handleWordClicked(boundingClientRect){
    const tooltipLayout = tooltipLayoutComputer(boundingClientRect)
    this.setState({
      tooltipLayout,
    })
  }

  render() {
    const {
      tooltipLayout
    } = this.state

    if (tooltipLayout) {
      return <div style={_.extend(tooltipLayout, {backgroundColor: 'red', position: 'fixed'})}></div>
    } else {
      return null
    }
  }
}

const mapStateToProps = (state) => {
  return {
  }
}

export default connect(mapStateToProps)(App)
