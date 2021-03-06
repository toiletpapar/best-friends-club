import * as React from 'react'
import styled from 'styled-components'
import { Switch, Route } from 'react-router-dom'

import { Codenames } from '../Codenames/index'
import { Lobby } from '../Lobby/index'
import { Nav as el } from '../Nav/index'
import { getRandomName, titleCase } from '../../utils/data'

const Background = styled('div')`
  background-color: ${(props): string => props.theme.lightgray};
  min-height: 100vh;
  height: 100%;
  display: grid;
  grid: 75px 1fr / 1fr
`

const Container = styled('div')`
  padding: ${(props): string => props.theme.pagePadding};
`

const Nav = styled(el)`
  padding: ${(props): string => props.theme.pagePadding};
  margin-bottom: 20px;
`

const Home = (): JSX.Element => {
  let user = localStorage.getItem('user')

  if (!user) {
    user = titleCase(getRandomName())
    localStorage.setItem('user', user)
  }

  return (
    <Background>
      <Nav user={user} />
      <Container>
        <Switch>
          <Route path='/codenames/:gameID' exact component={Codenames} />
          <Route component={Lobby} />
        </Switch>
      </Container>
    </Background>
  )
}

export {
  Home
}
