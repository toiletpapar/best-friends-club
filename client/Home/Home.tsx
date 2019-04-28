import * as React from 'react'
import styled from 'styled-components'

import { Nav as el } from '../Nav/index'
import { Codenames } from '../Codenames/index'

const Background = styled('div')`
  background-color: ${(props): string => props.theme.lightgray};
  font-family: sans-serif;
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
  return (
    <Background>
      <Nav />
      <Container>
        <Codenames />
      </Container>
    </Background>
  )
}

export {
  Home
}
