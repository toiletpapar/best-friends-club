import styled from 'styled-components'

interface ButtonInterface {
  left?: boolean;
}

const Button = styled('button')<ButtonInterface>`
  border: none;
  font-size: inherit;
  padding: 10px;
  width: 120px;
  border-radius: 5px;
  margin: 0px 10px;
  ${(props): string => props.left && 'margin-left: 0px;'}
  color: ${(props): string => props.theme.lightgray};
  background-color: ${(props): string => props.theme.blue};
`

export {
  Button
}