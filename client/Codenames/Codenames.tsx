import * as React from 'react'
import styled from 'styled-components'
import agent from 'superagent'
import {RouteComponentProps} from 'react-router-dom'

import { getTeamColours } from './utils'
import { SpymasterKey as SK } from './SpymasterKey'
import { Scoreboard as SB } from './Scoreboard'
import { Help } from './Help'
import { Chat } from '../Chat'
import { Message } from '../Chat/Chat'
import { Button } from '../common'

import { wsManager, WebSocketWrapper } from '../clientUtils'
import { GameData, Team } from '../../utils/Codenames/CodenamesGame'
import { createMessage, CodenameAction } from '../../utils/Codenames'
import { ChatAction } from '../../utils/Codenames/actions'

interface CodenamesRouterProps {
  gameID: string;
}

interface CardProps {
  team: Team;
}

const Container = styled('div')`
  display: grid;
  grid: [row1-start] "score score score score key key" auto [row1-end]
        [row2-start] "chat . . . . ." 100px [row2-end]
        [row3-start] "chat . . . . ." 100px [row3-end]
        [row4-start] "chat . . . . ." 100px [row4-end]
        [row5-start] "chat . . . . ." 100px [row5-end]
        [row6-start] "chat . . . . ." 100px [row6-end]
        [row7-start] "buttons buttons buttons buttons buttons buttons" auto [row7-end]
        / 250px 1fr 1fr 1fr 1fr 1fr;
  row-gap: 10px;
  column-gap: 10px;
`

const CodenamesChat = styled(Chat)`
  grid-area: chat;
  align-self: stretch;
`

const Scoreboard = styled(SB)`
  grid-area: score;
`

const SpymasterKey = styled(SK)`
  grid-area: key;
  place-self: end;
`

const InvisibleKey = styled('div')`
  grid-area: key;
`

const ButtonsContainer = styled('div')`
  grid-area: buttons;
  justify-self: end;
`

const Card = styled('div')<CardProps>`
  background-color: ${getTeamColours};
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`

interface CodenameSocketOptions {
  id: string;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setSocket: React.Dispatch<React.SetStateAction<WebSocketWrapper>>;
}

const setupCodenamesSocket = (opts: CodenameSocketOptions): void => {
  // Create WebSocket connection.
  const socket = new WebSocketWrapper(wsManager.createWebSocket(opts.id, `ws://localhost:8080/codenames/socket/${opts.id}`))

  // Listen for messages
  socket.onAction(CodenameAction.CHAT_MESSAGE, ({type, ...message}: ChatAction): void => {
    opts.setMessages((messages): Message[] => [...messages, message])
  })

  opts.setSocket(socket)
}

interface CodenameGameOptions {
  gameID: string;
  setGame: React.Dispatch<React.SetStateAction<GameData>>;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setSocket: React.Dispatch<React.SetStateAction<WebSocketWrapper>>;
}

// Retrieve game
const useCodenamesGame = (opts: CodenameGameOptions): void => {
  React.useEffect((): () => void => {
    if (opts.gameID) {
      agent.get(`/codenames/${opts.gameID}/player/board`).then(({body}): void => {
        opts.setGame(body)
        setupCodenamesSocket({id: body.id, setMessages: opts.setMessages, setSocket: opts.setSocket})
      }).catch((err): void => {
        console.error(`Unable to find game with gameID ${opts.gameID}`)
        console.error(err)
      })
    }

    return (): void => wsManager.closeWebSocket(opts.gameID)
  }, [opts])
}

const revealCard = (id: string, word: string, setGame: React.Dispatch<React.SetStateAction<GameData>>): () => void => (): void => {
  agent.patch(`/codenames/${id}/player/board/${word}`).then(({body}): void => {
    setGame(body)
  }).catch((err): void => {
    console.error('Unable to reveal card')
    console.error(err)
  })
}

const passTurn = (id: string, setGame: React.Dispatch<React.SetStateAction<GameData>>): () => void => (): void => {
  agent.patch(`/codenames/${id}/turn`).then(({body}): void => {
    setGame(body)
  }).catch((err): void => {
    console.error('Unable to pass turn')
    console.log(err)
  })
}

const resetGame = (id: string, setGame: React.Dispatch<React.SetStateAction<GameData>>, setSpymasterGame: React.Dispatch<React.SetStateAction<GameData>>): () => void => (): void => {
  agent.patch(`/codenames/${id}`).then(({body}): void => {
    setGame(body)
    setSpymasterGame(null)
  }).catch((err): void => {
    console.error('Unable to reset game')
    console.error(err)
  })
}

const toggleSpymaster = (id: string, spymasterGame: GameData, setSpymasterGame: React.Dispatch<React.SetStateAction<GameData>>): () => void => (): void => {
  if (!spymasterGame) {
    agent.get(`/codenames/${id}/spymaster/board`).then(({body}): void => {
      setSpymasterGame(body)
    }).catch((err): void => {
      console.error('Unable to reset game')
      console.error(err)
    })
  } else {
    setSpymasterGame(null)
  }
}

const useToggle = (initialState: boolean): [boolean, () => void] => {
  const [property, setter] = React.useState(initialState)

  return [
    property,
    (): void => {
      setter(!property)
    }
  ]
}

const sendChatMessage = (socket: WebSocketWrapper, message: string): void => {
  socket.send(createMessage(message, Date.now(), 'test_user'))
}

const Codenames = (props: RouteComponentProps<CodenamesRouterProps>): JSX.Element => {
  const gameID = props.match.params.gameID
  const [game, setGame] = React.useState<GameData>(null)
  const [messages, setMessages] = React.useState<Message[]>([])
  const [socket, setSocket] = React.useState<WebSocketWrapper>(null)
  const gameOptions = React.useMemo((): CodenameGameOptions => ({gameID, setGame, setMessages, setSocket}), [gameID, setGame, setMessages, setSocket])

  useCodenamesGame(gameOptions)

  const [spymasterGame, setSpymasterGame] = React.useState<GameData>(null)
  const [helpOpen, toggleHelp] = useToggle(false)
  const [message, setMessage] = React.useState<string>('')

  if (!game) {
    return (<div />)
  }

  return (
    <React.Fragment>
      <Container>
        <CodenamesChat
          messages={messages}
          message={message}
          onMessageChange={setMessage}
          onEnter={(): void => {
            sendChatMessage(socket, message)
            setMessage('')
          }}
        />
        <Scoreboard isSpymaster={!!spymasterGame} game={game} />
        { spymasterGame ? <SpymasterKey game={spymasterGame} /> : <InvisibleKey /> }
        {
          game.board.map((card): JSX.Element => {
            return (
              <Card key={card.word} team={card.faction} onClick={revealCard(game.id, card.word, setGame)}>{card.word}</Card>
            )
          })
        }
        <ButtonsContainer>
          <Button onClick={toggleHelp}>Help</Button>
          <Button onClick={toggleSpymaster(game.id, spymasterGame, setSpymasterGame)}>{spymasterGame ? 'Operative View' : 'Spymaster View'}</Button>
          <Button onClick={passTurn(game.id, setGame)}>Next Turn</Button>
          <Button onClick={resetGame(game.id, setGame, setSpymasterGame)}>New Game</Button>
        </ButtonsContainer>
      </Container>
      {
        helpOpen && (
          <Help />
        )
      }
    </React.Fragment>
  )
}

export {
  Codenames
}