import styled from 'styled-components'

interface HeaderProps {
  top?: boolean;
}

const Header = styled('h3')<HeaderProps>`
  ${(props): any => props.top && `margin-top: 0;`}
`

export {
  Header,
}