import * as React from 'react'
import * as agent from 'superagent'

import { LinkButton, Button } from '../common/index'
import { GameIDList } from './GameIDList'
import { GameData } from '../../utils/Codenames/CodenamesGame'

// Create a game and update the game's list
const createGame = (
  gameIDs: string[],
  setGameIDs: React.Dispatch<React.SetStateAction<string[]>>
): () => void => {
  return (): void => {
    agent.post('/codenames').then(({body}): void => {
      setGameIDs([...gameIDs, body.id])
    }).catch((err): void => {
      console.error('Unable to initialize codenames game')
      console.error(err)
    })
  }
}

// Retrieve the game's list from the server
const useGameIDs = (
  setGameIDs: React.Dispatch<React.SetStateAction<string[]>>
): void => {
  React.useEffect((): void => {
    agent.get('/codenames').then(({body}): void => {
      setGameIDs(body.map((game: GameData): string => game.id))
    }).catch((err): void => {
      console.error('Unable to retrieve codenames game list')
      console.error(err)
    })
  }, [setGameIDs])
}

const Lobby = (): JSX.Element => {
  const [gameIDs, setGameIDs] = React.useState<string[]>([])
  const [selectedGameID, setSelectedGameID] = React.useState<string>('')

  useGameIDs(setGameIDs)

  return (
    <React.Fragment>
      <h3>Codenames</h3>
      <p>Choose a game from the list below or create your own.</p>
      <GameIDList
        gameIDs={gameIDs}
        onGameIDSelected={setSelectedGameID}
        selectedGameID={selectedGameID}
      />
      <Button left onClick={createGame(gameIDs, setGameIDs)}>Create Game</Button>
      <LinkButton to={`/codenames/${selectedGameID}`}>Join Game</LinkButton>
    </React.Fragment>
  )
}

export {
  Lobby
}
