import * as React from 'react'
import styled from 'styled-components'
import agent from 'superagent'

import { GameData, Team, GameState } from '../../utils/Codenames/CodenamesGame'

interface CodenamesState {
  game: GameData;
}

interface CardProps {
  team: Team;
}

const Container = styled('div')`
  display: grid;
  grid: [row1-start] "title title title title title" auto [row1-end]
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

const Button = styled('button')`
  padding: 10px 25px;
  border: none;
  outline: none;
  cursor: pointer;
  background-color: ${(props): string => props.theme.green};
`

const TitleContainer = styled('div')`
  grid-area: title;
`

const ButtonsContainer = styled('div')`
  grid-area: buttons;
  justify-self: end;
`

const Card = styled('div')<CardProps>`
  background-color: ${(props): string => {
    if (props.team === Team.UNKNOWN) {
      return props.theme.gray
    } else if (props.team === Team.FIRSTTEAM) {
      return props.theme.red
    } else if (props.team === Team.SECONDTEAM) {
      return props.theme.blue
    } else if (props.team === Team.BYSTANDER) {
      return props.theme.darkgray
    } else if (props.team === Team.ASSASSIN) {
      return props.theme.black
    } else {
      console.warn('Unknown team provided')
    }
  }};
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`

class Codenames extends React.PureComponent<{}, CodenamesState> {
  public constructor(props: {}) {
    super(props)
    this.state = {
      game: null
    }
  }

  public componentDidMount (): void {
    agent.post('/codenames').then(({body}): void => {
      this.setState({
        game: body,
      })
    }).catch((err): void => {
      console.error('Unable to initialize codenames game')
      console.error(err)
    })
  }

  private revealCard = (id: string, word: string): any => (): void => {
    agent.patch(`/codenames/${id}/player/board/${word}`).then(({body}): void => {
      this.setState({
        game: body,
      })
    }).catch((err): void => {
      console.error('Unable to reveal card')
      console.error(err)
    })
  }

  private resetGame = (id: string): any => (): void => {
    agent.patch(`/codenames/${id}`).then(({body}): void => {
      this.setState({
        game: body,
      })
    }).catch((err): void => {
      console.error('Unable to reset game')
      console.error(err)
    })
  }

  public render (): JSX.Element {
    if (!this.state.game) {
      return (<div />)
    }

    return (
      <Container>
        <TitleContainer>
          <h3>Spymaster</h3>
          <div>Current Turn: {this.state.game.currentTurn === Team.FIRSTTEAM ? 'Red Team' : 'Blue Team'}</div>
          <div>Red Team: {this.state.game.score.firstTeamScore}</div>
          <div>Blue Team: {this.state.game.score.secondTeamScore}</div>
          {
            this.state.game.gameState === GameState.FIRSTTEAMWIN ? 'Red Team Wins' : this.state.game.gameState === GameState.SECONDTEAMWIN ? 'Blue Team Wins' : null
          }
        </TitleContainer>
        {
          this.state.game.board.map((card): JSX.Element => {
            return (
              <Card key={card.word} team={card.faction} onClick={this.revealCard(this.state.game.id, card.word)}>{card.word}</Card>
            )
          })
        }
        <ButtonsContainer>
          <Button onClick={this.resetGame(this.state.game.id)}>New Game</Button>
        </ButtonsContainer>
      </Container>
    )
  }
}

export {
  Codenames
}
