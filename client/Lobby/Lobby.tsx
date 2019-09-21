import * as React from 'react'
import * as agent from 'superagent'
import styled from 'styled-components'
import { RouteComponentProps } from 'react-router'

import { Button, Modal, TextInput, Header } from '../common/index'
import { GameList } from './GameList'
import { GameData } from '../../utils/Codenames/CodenamesGame'

const ModalContainer = styled(Modal)`
  display: grid;
  grid:  
    [row1-start] "header header" 2fr [row1-end]
    [row2-start] ". ." 1fr [row2-end]
    [row3-start] "button button" 2fr [row3-end]
    / 1fr 2fr;
  align-items: center;
  grid-gap: 10px 0px;
`

const ModalHeader = styled(Header)`
  grid-area: header;
`

const ModalButton = styled(Button)`
  grid-area: button;
`

// Create a game and update the game's list
const createGame = (
  games: GameData[],
  setGames: React.Dispatch<React.SetStateAction<GameData[]>>,
  gameName: string,
): void => {
  agent.post('/codenames').send({name: gameName}).then(({body}): void => {
    setGames([...games, body])
  }).catch((err): void => {
    console.error('Unable to initialize codenames game')
    console.error(err)
  })
}

// Retrieve the game's list from the server
const useGames = (
  setGames: React.Dispatch<React.SetStateAction<GameData[]>>
): void => {
  React.useEffect((): void => {
    agent.get('/codenames').then(({body}): void => {
      setGames(body)
    }).catch((err): void => {
      console.error('Unable to retrieve codenames game list')
      console.error(err)
    })
  }, [setGames])
}

const Lobby = (props: RouteComponentProps<{}>): JSX.Element => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false)
  const [games, setGames] = React.useState<GameData[]>([])
  const [selectedGameID, setSelectedGameID] = React.useState<string>('')
  const [gameName, setGameName] = React.useState<string>('')

  useGames(setGames)

  const createAndClose = (): void => {
    createGame(games, setGames, gameName)
    setIsOpen(false)
  }

  return (
    <React.Fragment>
      <Header>Codenames</Header>
      <p>Choose a game from the list below or create your own.</p>
      <GameList
        games={games}
        onGameIDSelected={setSelectedGameID}
        selectedGameID={selectedGameID}
      />
      <Button left onClick={(): void => setIsOpen(true)}>Create Game</Button>
      <Button onClick={(): void => props.history.push(`/codenames/${selectedGameID}`)}>Join Game</Button>
      {
        isOpen && (
          <ModalContainer onClose={(): void => setIsOpen(false)}>
            <ModalHeader>Create Game</ModalHeader>
            <TextInput
              name='name'
              title='Game Name:'
              value={gameName}
              onUpdate={setGameName}
            />
            <ModalButton left onClick={createAndClose}>Create</ModalButton>
          </ModalContainer>
        )
      }
    </React.Fragment>
  )
}

export {
  Lobby
}
