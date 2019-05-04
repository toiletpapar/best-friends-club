import * as React from 'react'
import styled from 'styled-components'
import agent from 'superagent'

import { getTeamColours } from './utils'
import { SpymasterKey as SK } from './SpymasterKey'
import { Scoreboard as SB } from './Scoreboard'
import { Help } from './Help'

import { GameData, Team } from '../../utils/Codenames/CodenamesGame'

interface CodenamesState {
  game: GameData;
  spymasterGame: GameData;
  helpOpen: boolean;
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

const Button = styled('button')`
  padding: 10px 0px;
  width: 120px;
  margin: 0px 5px;
  border: none;
  outline: none;
  cursor: pointer;
  background-color: ${(props): string => props.theme.green};
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

class Codenames extends React.PureComponent<{}, CodenamesState> {
  public constructor(props: {}) {
    super(props)
    this.state = {
      game: null,
      spymasterGame: null,
      helpOpen: false
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

  private passTurn = (id: string): any => (): void => {
    agent.patch(`/codenames/${id}/turn`).then(({body}): void => {
      this.setState({
        game: body,
      })
    }).catch((err): void => {
      console.error('Unable to pass turn')
      console.log(err)
    })
  }

  private resetGame = (id: string): any => (): void => {
    agent.patch(`/codenames/${id}`).then(({body}): void => {
      this.setState({
        game: body,
        spymasterGame: null
      })
    }).catch((err): void => {
      console.error('Unable to reset game')
      console.error(err)
    })
  }

  private toggleSpymaster = (id: string): any => (): void => {
    if (!this.state.spymasterGame) {
      agent.get(`/codenames/${id}/spymaster/board`).then(({body}): void => {
        console.log(body)
        this.setState({
          spymasterGame: body
        })
      }).catch((err): void => {
        console.error('Unable to reset game')
        console.error(err)
      })
    } else {
      this.setState({
        spymasterGame: null
      })
    }
  }

  private toggleHelp = (): void => {
    this.setState({
      helpOpen: !this.state.helpOpen
    })
  }

  public render (): JSX.Element {
    if (!this.state.game) {
      return (<div />)
    }

    return (
      <React.Fragment>
        <Container>
          <Scoreboard game={this.state.game} />
          { this.state.spymasterGame ? <SpymasterKey game={this.state.spymasterGame} /> : <InvisibleKey /> }
          {
            this.state.game.board.map((card): JSX.Element => {
              return (
                <Card key={card.word} team={card.faction} onClick={this.revealCard(this.state.game.id, card.word)}>{card.word}</Card>
              )
            })
          }
          <ButtonsContainer>
            <Button onClick={this.toggleHelp}>Help</Button>
            <Button onClick={this.toggleSpymaster(this.state.game.id)}>{this.state.spymasterGame ? 'Spymaster' : 'Field Operative'}</Button>
            <Button onClick={this.passTurn(this.state.game.id)}>Next Turn</Button>
            <Button onClick={this.resetGame(this.state.game.id)}>New Game</Button>
          </ButtonsContainer>
        </Container>
        {
          this.state.helpOpen && (
            <Help />
          )
        }
      </React.Fragment>
    )
  }
}

export {
  Codenames
}
