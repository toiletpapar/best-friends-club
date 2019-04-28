import * as React from 'react'

import { Nav } from '../Nav/index'
import { Codenames } from '../Codenames/index'

const Home = (): JSX.Element => {
  return (
    <div>
      <Nav />
      <Codenames />
    </div>
  )
}

export {
  Home
}
