import * as React from 'react'
import styled from 'styled-components'

import Logo from '../assets/logo.png'
import { Link } from '../common/index'

const LogoImg = styled('img')`
  width: 75px;
`

const Container = styled('div')`
  display: flex;
  background-color: ${(props): string => props.theme.black};
  color: ${(props): string => props.theme.white};
  align-items: center;
`

const Nav = (props: React.PropsWithoutRef<JSX.IntrinsicElements['div']>): JSX.Element => {
  return (
    <Container className={props.className}>
      <LogoImg src={Logo} />
      <Link to='/'>Lobby</Link>
    </Container>
  )
}

export {
  Nav
}
