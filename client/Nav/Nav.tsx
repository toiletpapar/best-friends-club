import * as React from 'react'
import styled from 'styled-components'

const Container = styled('div')`
  background-color: ${(props): string => props.theme.black};
  color: ${(props): string => props.theme.white};
  height: 100px;
`

const Nav = (): JSX.Element => {
  return (
    <Container>
      Hello World
    </Container>
  )
}

export {
  Nav
}
