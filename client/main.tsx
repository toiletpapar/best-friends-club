import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from './App'

const root = document.createElement('div')
document.body.appendChild(root)
document.body.setAttribute('style', 'margin: 0; font-size: 12px; font-family: sans-serif;')

ReactDOM.render(<App />, root)
