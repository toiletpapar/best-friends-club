import styled from 'styled-components'

interface ButtonInterface {
  left?: boolean
}

const Button = styled('button')<ButtonInterface>`
  border: none;
  outline: none;
  font-size: inherit;
  padding: 10px;
  width: 100px;
  border-radius: 5px;
  margin: 0px 10px;
  ${(props) => props.left && 'margin-left: 0px;'}
  color: ${(props) => props.theme.lightgray};
  background-color: ${(props) => props.theme.blue};
`

export {
  Button
}