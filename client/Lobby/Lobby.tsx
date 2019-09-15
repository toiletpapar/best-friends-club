import * as React from 'react'
import styled from 'styled-components'
import * as agent from 'superagent'

import { Link } from 'react-router-dom'

interface Highlight {
  active?: boolean;
}

const GameIDList = styled('ul')`
  list-style-type: none;
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
      <GameIDList>
        {
          gameIDs.map((gameID): React.ReactNode => {
            return (
              <GameID key={gameID} active={selectedGameID === gameID} onClick={(): void => setSelectedGameID(gameID)}>{gameID}</GameID>
            )
          })
        }
      </GameIDList>
      <button onClick={createGame(gameIDs, setGameID)}>Create Game</button>
      <Link to={`/codenames/${selectedGameID}`}>Join Game</Link>
    </React.Fragment>
  )
}

export {
  Lobby
}
