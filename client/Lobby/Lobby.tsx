import * as React from 'react'
import styled from 'styled-components'
import * as agent from 'superagent'

import { LinkButton, Button } from '../common/index'

interface Highlight {
  active?: boolean;
}

const GameIDList = styled('ul')`
  list-style-type: none;
  border: 1px solid black;
  min-height: 50px;
  max-height: 400px;
  border-radius: 5px;
  overflow-y: auto;
  padding: 0;
`

const GameID = styled('li')<Highlight>`
  ${(props): string => props.active && `background-color: ${props.theme.darkgray}`}
`

const createGame = (
  gameIDs: string[],
  setGameID: React.Dispatch<React.SetStateAction<string[]>>
): () => void => {
  return (): void => {
    agent.post('/codenames').then(({body}): void => {
      setGameID([...gameIDs, body.id])
    }).catch((err): void => {
      console.error('Unable to initialize codenames game')
      console.error(err)
    })
  }
}

const Lobby = (): JSX.Element => {
  const [gameIDs, setGameID] = React.useState<string[]>([])
  const [selectedGameID, setSelectedGameID] = React.useState<string>('')

  return (
    <React.Fragment>
      <h3>Codenames</h3>
      <p>Choose a game from the list below or create your own.</p>
      <GameIDList>
        {
          gameIDs.map((gameID): React.ReactNode => {
            return (
              <GameID key={gameID} active={selectedGameID === gameID} onClick={(): void => setSelectedGameID(gameID)}>{gameID}</GameID>
            )
          })
        }
      </GameIDList>
      <Button left onClick={createGame(gameIDs, setGameID)}>Create Game</Button>
      <LinkButton to={`/codenames/${selectedGameID}`}>Join Game</LinkButton>
    </React.Fragment>
  )
}

export {
  Lobby
}
