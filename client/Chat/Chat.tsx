import React from 'react'
import styled from 'styled-components'
import moment from 'moment'

interface Message {
  timestamp: number;
  user: string;
  message: string;
}

interface ChatProps {
  messages: Message[];
  className?: string;
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
  max-height: 460px;
`

const Message = styled('div')`
  margin: 5px 0px;
`

const Textarea = styled('textarea')`
  height: 50px;
  width: 100%;
  box-sizing: border-box;
  resize: none;
`

const Chat = (props: ChatProps): JSX.Element => {
  return (
    <Container className={props.className}>
      <ChatContainer>
        {
          props.messages.map(({timestamp, user, message}, index): React.ReactNode => {
            return (
              //key={`${user}-${timestamp}`}
              <Message key={index}>
                {`[${moment(timestamp).format('HH:mm:ss')}] `}<b>{`${user}: `}</b>{`${message}`}
              </Message>
            )
          })
        }
      </ChatContainer>
      <hr />
      <Textarea />
    </Container>
  )
}

export {
  Chat
}