import React from 'react'
import styled from 'styled-components'

interface TextInputProps extends React.HTMLProps<HTMLInputElement> {
  title?: string;
  onUpdate?: (text: string) => void;
}

const Input = styled('input')`
  border: none;
  border-bottom: 1px solid ${(props): string => props.theme.gray};
`
const Label = styled('label')`
  color: black;
  display: block;
  margin-bottom: 2px;
`

const createOnChange = (props: TextInputProps): (event: React.ChangeEvent<HTMLInputElement>) => void => (event: React.ChangeEvent<HTMLInputElement>): void => {
  if (props.onChange) {
    props.onChange(event)
  }

  if (props.onUpdate) {
    props.onUpdate(event.target.value)
  }
}

const TextInput = (props: TextInputProps): JSX.Element => {
  const {
    name,
    title,
    value,
    disabled
  } = props

  return (
    <React.Fragment>
      <Label htmlFor={name} hidden={!props.title}>{title}</Label>
      <Input name={name} onChange={createOnChange(props)} value={value} disabled={disabled}  />
    </React.Fragment>
  )
}

export {
  TextInput,
}