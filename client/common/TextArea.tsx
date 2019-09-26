import React from 'react'

interface TextAreaProps extends React.HTMLProps<HTMLTextAreaElement> {
  onUpdate?: (text: string) => void;
}

const createOnChange = (props: TextAreaProps): (event: React.ChangeEvent<HTMLTextAreaElement>) => void => (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
  if (props.onChange) {
    props.onChange(event)
  }

  if (props.onUpdate) {
    props.onUpdate(event.target.value)
  }
}

const TextArea = (props: TextAreaProps): JSX.Element => {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { onUpdate, onChange, ...textareaProps } = props

  return (
    <textarea
      {...textareaProps}
      onChange={createOnChange(props)}
    />
  )
}

export {
  TextArea
}