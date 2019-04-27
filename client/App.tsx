import { hot } from 'react-hot-loader/root'
import * as React from 'react'

import { ThemeProvider } from 'styled-components'
import theme from './theme.json'

import { Home } from './Home/index'

const App = (): JSX.Element => {
  return (
    <ThemeProvider theme={theme}>
      <Home />
    </ThemeProvider>
  )
}

export default hot(App)