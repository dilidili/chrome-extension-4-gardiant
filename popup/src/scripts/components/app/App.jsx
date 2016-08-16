import React from 'react'
import {connect} from 'react-redux'
import './react-swicth-button.min.css'
import SwitchButton from 'react-switch-button' 

const App = React.createClass({
  handleModeChange(evt) {
    this.props.dispatch({
      type: !this.props.isPagingMode ? "TURN_ON_PAGING_MODE" : "TURN_OFF_PAGING_MODE",
    })
  },

  render() {
    return (
      <div>
        <SwitchButton name="switch-2" checked={this.props.isPagingMode} onChange={this.handleModeChange}/>
      </div>
    )
  }
})

const mapStateToProps = (state) => {
  return {
    isPagingMode: state.isPagingMode
  }
}

export default connect(mapStateToProps)(App)
