import * as React from 'react'
import styled from 'styled-components'
import agent from 'superagent'

import { GameData, Team } from '../../utils/Codenames/CodenamesGame'

interface CodenamesState {
  game: GameData;
}

interface CardProps {
  team: Team;
}

const Container = styled('div')`
  display: grid;
  grid: auto-flow 100px / 1fr 1fr 1fr 1fr 1fr
  height: 100%;
  row-gap: 10px;
  column-gap: 10px;
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
    agent.patch(`/codenames/${id}/board/${word}`).then(({body}): void => {
      console.log(body)
      this.setState({
        game: body,
      })
    }).catch((err): void => {
      console.error('Unable to reveal card')
      console.error(err)
    })
  }

  public render (): JSX.Element {
    if (!this.state.game) {
      return (<div />)
    }

    return (
      <Container>
        {
          this.state.game.board.map((card): JSX.Element => {
            return (
              <Card key={card.word} team={card.faction} onClick={this.revealCard(this.state.game.id, card.word)}>{card.word}</Card>
            )
          })
        }
      </Container>
    )
  }
}

export {
  Codenames
}
