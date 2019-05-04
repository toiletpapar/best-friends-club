import * as React from 'react'
import styled from 'styled-components'

import { getTeamColours } from './utils'
import { GameData, Team } from '../../utils/Codenames/CodenamesGame'

interface SpymasterKeyProps extends React.PropsWithoutRef<JSX.IntrinsicElements['div']> {
  game: GameData;
}

interface BlockProps {
  team: Team;
}

const Grid = styled('div')`
  display: grid;
  grid: repeat(5, 20px) / repeat(5, 20px);
  grid-gap: 2px;
`

const Block = styled('div')<BlockProps>`
  background-color: ${getTeamColours};
`

const SpymasterKey = (props: SpymasterKeyProps): JSX.Element => {
  return (
    <Grid className={props.className}>
      {
        props.game.board.map((card): JSX.Element => {
          return (
            <Block key={card.word} team={card.faction} />
          )
        })
      }
    </Grid>
  )
}

export {
  SpymasterKey
}
