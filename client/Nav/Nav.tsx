import * as React from 'react'
import styled from 'styled-components'

const Container = styled('div')`
  background-color: ${(props): string => props.theme.black};
  color: ${(props): string => props.theme.white};
`

const Nav = (props: React.PropsWithoutRef<JSX.IntrinsicElements['div']>): JSX.Element => {
  return (
    <Container className={props.className}>
      Hello World
    </Container>
  )
}

export {
  Nav
}
