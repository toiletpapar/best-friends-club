import React from 'react'
import { BrowserRouter as Router, Route, Link  } from 'react-router-dom'

import { Home } from './Home/index'

const AppRouter = (): JSX.Element => {
  return (
    <Router>
      <Route path='/' exact component={Home} />
    </Router>
  )
}

export {
  AppRouter,
}
