import * as React from 'react'
import styled from 'styled-components'

import { CodenamesGame } from '../../utils/Codenames/index'

export interface CodenamesState {
  game: CodenamesGame;
}

const Container = styled('div')`
  display: grid;
  grid: 1fr 1fr 1fr 1fr 1fr / 1fr 1fr 1fr 1fr 1fr
  row-gap: 10px;
  column-gap: 10px;
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
              <div key={card.word}>{card.word}</div>
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
