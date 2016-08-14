import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import {Store} from 'react-chrome-redux'
import adBlocker from './adBlocker'
import App from './components/app/App'

// Remove ads
adBlocker()

// Insert the react anchor dom element 
const anchor = document.createElement('div')
anchor.id = Math.random().toString(32).slice(2)
document.body.insertBefore(anchor, document.body.childNodes[0])

// Mount react root component
const proxyStore = new Store({portName: 'default'})
render(<Provider store={proxyStore}><App/></Provider>, document.getElementById(anchor.id))