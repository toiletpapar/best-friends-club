import * as React from 'react'
import styled from 'styled-components'
import agent from 'superagent'
import {RouteComponentProps} from 'react-router-dom'

import { getTeamColours } from './utils'
import { SpymasterKey as SK } from './SpymasterKey'
import { Scoreboard as SB } from './Scoreboard'
import { Help } from './Help'
import { Button } from '../common'

import { GameData, Team } from '../../utils/Codenames/CodenamesGame'

interface CodenamesRouterProps {
  gameID: string;
}

interface CardProps {
  team: Team;
}

const Container = styled('div')`
  display: grid;
  grid: [row1-start] "score score score key key" auto [row1-end]
        [row2-start] ". . . . ." 100px [row2-end]
        [row3-start] ". . . . ." 100px [row3-end]
        [row4-start] ". . . . ." 100px [row4-end]
        [row5-start] ". . . . ." 100px [row5-end]
        [row6-start] ". . . . ." 100px [row6-end]
        [row7-start] "buttons buttons buttons buttons buttons" auto [row7-end]
        / 1fr 1fr 1fr 1fr 1fr;
  row-gap: 10px;
  column-gap: 10px;
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

const useCodenamesGame = (gameID: string): [GameData, React.Dispatch<React.SetStateAction<GameData>>] => {
  const [game, setGame] = React.useState<GameData>(null)

  React.useEffect((): void => {
    if (gameID) {
      agent.get(`/codenames/${gameID}/player/board`).then(({body}): void => {
        setGame(body)
      }).catch((err): void => {
        console.error(`Unable to find game with gameID ${gameID}`)
        console.error(err)
      })
    }
  }, [gameID])

  return [game, setGame]
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

const Codenames = (props: RouteComponentProps<CodenamesRouterProps>): JSX.Element => {
  const [game, setGame] = useCodenamesGame(props.match.params.gameID)
  const [spymasterGame, setSpymasterGame] = React.useState<GameData>(null)
  const [helpOpen, toggleHelp] = useToggle(false)

  if (!game) {
    return (<div />)
  }

  return (
    <React.Fragment>
      <Container>
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