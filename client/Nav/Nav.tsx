import * as React from 'react'
import styled from 'styled-components'

const Container = styled('div')`
  background-color: ${(props) => props.theme.black};
  color: ${(props) => props.theme.white};
  height: 100px;
`

const Nav = () => {
  return (
    <Container>
      Hello World
    </Container>
  )
}

export {
  Nav
}
