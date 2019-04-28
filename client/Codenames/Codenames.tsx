import * as React from 'react'
import styled from 'styled-components'

import { CodenamesGame } from '../../utils/Codenames/index'

export interface CodenamesState {
  game: CodenamesGame;
}

const Container = styled('div')`
  display: grid;
  grid: auto-flow 100px / 1fr 1fr 1fr 1fr 1fr
  height: 100%;
  row-gap: 10px;
  column-gap: 10px;
`

const Card = styled('div')`
  background-color: ${(props): string => props.theme.gray};
  display: flex;
  justify-content: center;
  align-items: center;
`

class Codenames extends React.PureComponent<{}, CodenamesState> {
  public constructor(props: {}) {
    super(props)
    this.state = {
      game: new CodenamesGame()
    }
  }

  public render (): JSX.Element {
    // console.log(this.state.game)

    return (
      <Container>
        {
          this.state.game.getState().board.map((card): JSX.Element => {
            return (
              <Card key={card.word}>{card.word}</Card>
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
