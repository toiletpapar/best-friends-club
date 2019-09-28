import * as React from 'react'
import styled from 'styled-components'

import Logo from '../assets/logo.png'
import { Link } from '../common/index'

const LogoImg = styled('img')`
  width: 75px;
`

const NavLink = styled(Link)`
  margin: 0px 20px;
`

const Container = styled('div')`
  display: flex;
  background-color: ${(props): string => props.theme.black};
  color: ${(props): string => props.theme.white};
  align-items: center;
`

const UserLink = styled(NavLink)`
  flex: 1;
  text-align: right;
`

interface NavProps extends React.PropsWithoutRef<JSX.IntrinsicElements['div']> {
  user: string;
}

const Nav = (props: NavProps): JSX.Element => {
  return (
    <Container className={props.className}>
      <LogoImg src={Logo} />
      <NavLink to='/'>Lobby</NavLink>
      <UserLink to='/profile'>Welcome {props.user || ''}!</UserLink>
    </Container>
  )
}

export {
  Nav
}
