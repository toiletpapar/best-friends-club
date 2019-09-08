import { hot } from 'react-hot-loader/root'
import * as React from 'react'

import { ThemeProvider } from 'styled-components'
import theme from './theme.json'

import { AppRouter } from './Router'

const App = (): JSX.Element => {
  return (
    <ThemeProvider theme={theme}>
      <AppRouter />
    </ThemeProvider>
  )
}

export default hot(App)