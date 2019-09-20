import styled from 'styled-components'
import { Link as RouterLink } from 'react-router-dom'

const Link = styled(RouterLink)`
  text-decoration: none;
  color: inherit;
`

const LinkButton = styled(Link)`
  width: 100px;
  display: inline-block;
  text-align: center;
  box-sizing: border-box;
  padding: 10px;
  border-radius: 5px;
  margin: 0px 10px;
  color: ${(props) => props.theme.lightgray};
  background-color: ${(props) => props.theme.blue};
`

export {
  Link,
  LinkButton
}