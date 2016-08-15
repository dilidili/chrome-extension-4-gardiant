import React, {Component} from 'react'
import {connect} from 'react-redux'
import clickTranslator from '../../clickTranslator'
import _ from 'underscore'
import styles from './App.less'
import WordDescription from './WordDescription'
import {TransitionMotion, spring, presets} from 'react-motion'
import tooltipLayoutComputer from './tooltipLayoutComputer'
import {bindActionCreators} from 'redux'
import axios from 'axios'

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
const get_url_search_word = (text) => `https://api.shanbay.com/bdc/search/?word=${encodeURIComponent(text)}`

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      tooltipLayouts: [],
      /**
       * the state of searching word action
       * 0 - have not searched any thing
       * 1 - searching
       * 2 - the result returned successfully
       * 3 - network error
       * 4 - no result found 
       * @type {Number}
       */
      searchState: 0,
      /**
       * refer to http://www.shanbay.com/developer/wiki/api_v1/#query_word  
       * @type {Object}
       */
      searchResult: {},
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
      tooltipLayout.text = text
      this.setState({
        tooltipLayouts: [tooltipLayout],
      })
    }
  }
  handleSearch(text){
    // start searching
    this.setState({
      searchState: 1,
      searchResult: {},
    })

    axios.get(get_url_search_word(text)).then((res) => {
      const data = res.data 

      // result not found
      if (data.status_code === 1) {
        this.setState({
          searchState: 4
        })
      }else{
        // valid results returned
        this.setState({
          searchState: 2,
          searchResult: data.data,
        })
      }
    }).catch((error)=>{
      console.log(error)
      // network error
      this.setState({
        searchState: 3,
      })
    })
  }
  willLeave() {
    return {
      opacity: spring(0),
      scale: 1,
    }
  }
  willEnter(style) {
    this.handleSearch(style.data.text)

    return {
      opacity: 0,
      scale: 0,
    }
  }

  // Render
  render() {
    const {
      tooltipLayouts,
      searchState,
      searchResult,
    } = this.state

    return (
      <TransitionMotion
        willLeave={this.willLeave.bind(this)}
        willEnter={this.willEnter.bind(this)}
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
                      <WordDescription searchState={searchState} searchResult={searchResult}></WordDescription>
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
