import React from 'react'
import styled from 'styled-components'
import moment from 'moment'

import { TextArea as TA } from '../common'

export interface Message {
  timestamp: number;
  user: string;
  message: string;
}

export interface ChatProps {
  messages: Message[];
  message: string;
  onEnter: () => void;
  onMessageChange: (message: string) => void;
  className?: string;
}

export interface KeyMap {
  [keyName: string]: boolean;
}

const Container = styled('div')`
  border: 1px solid black;
  border-radius: 5px;
  padding: 5px;
  background-color: white;
  height: 540px;
  box-sizing: border-box;

  & input {
    border: none;
  }
`

const ChatContainer = styled('div')`
  overflow-y: auto;
  height: 460px;
`

const Message = styled('div')`
  margin: 5px 0px;
`

const TextArea = styled(TA)`
  height: 50px;
  width: 100%;
  box-sizing: border-box;
  resize: none;
`

const onKeyDown = (props: ChatProps, keyMap: KeyMap, setKeyMap: React.Dispatch<React.SetStateAction<KeyMap>>): (event: React.KeyboardEvent<HTMLTextAreaElement>) => void => (event: React.KeyboardEvent<HTMLTextAreaElement>): void => {
  const newKeyMap = {
    ...keyMap,
    [event.key]: true
  }
  
  setKeyMap(newKeyMap)
  
  if (newKeyMap['Enter'] && newKeyMap['Shift']) {
    // New line
    props.onMessageChange(props.message + '\n')
    return
  } else if (newKeyMap['Enter']) {
    props.onEnter()
  }
}

const onKeyUp = (keyMap: KeyMap, setKeyMap: React.Dispatch<React.SetStateAction<KeyMap>>): (event: React.KeyboardEvent<HTMLTextAreaElement>) => void => (event: React.KeyboardEvent<HTMLTextAreaElement>): void => {
  const newKeyMap = {
    ...keyMap,
    [event.key]: false
  }
  
  setKeyMap(newKeyMap)
}

const onMessage = (props: ChatProps): (message: string) => void => (message): void => {
  const lastChar = message[message.length - 1]

  if (lastChar === '\n') {
    props.onMessageChange(message.substring(0, message.length - 1))
    return
  }
  props.onMessageChange(message)
}

const Chat = (props: ChatProps): JSX.Element => {
  const [keyMap, setKeyMap] = React.useState<{[keyName: string]: boolean}>({})

  return (
    <Container className={props.className}>
      <ChatContainer>
        {
          props.messages.length > 0 ? (
            props.messages.map(({timestamp, user, message}): React.ReactNode => {
              return (
                <Message key={`${user}-${timestamp}`}>
                  {`[${moment(timestamp).format('HH:mm:ss')}] `}<b>{`${user}: `}</b>{`${message}`}
                </Message>
              )
            })
          ) : (
            <Message>It&apos;s quiet in here...echoooo <span style={{fontSize: '10px'}}>echoooo</span> <span style={{fontSize: '6px'}}>echoooo</span></Message>
          )
        }
      </ChatContainer>
      <hr />
      <TextArea
        value={props.message}
        onUpdate={onMessage(props)}
        onKeyDown={onKeyDown(props, keyMap, setKeyMap)}
        onKeyUp={onKeyUp(keyMap, setKeyMap)}
      />
    </Container>
  )
}

export {
  Chat
}