import * as React from 'react'
import * as agent from 'superagent'

import { LinkButton, Button } from '../common/index'
import { GameIDList } from './GameIDList'

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
      <GameIDList
        gameIDs={gameIDs}
        onGameIDSelected={setSelectedGameID}
        selectedGameID={selectedGameID}
      />
      <Button left onClick={createGame(gameIDs, setGameID)}>Create Game</Button>
      <LinkButton to={`/codenames/${selectedGameID}`}>Join Game</LinkButton>
    </React.Fragment>
  )
}

export {
  Lobby
}
