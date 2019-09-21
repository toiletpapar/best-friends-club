import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Home } from './Home/index'

const AppRouter = (): JSX.Element => {
  return (
    <Router>
      <div id='modal-container' />
      <Route path='/' component={Home} />
    </Router>
  )
}

export {
  AppRouter,
}
