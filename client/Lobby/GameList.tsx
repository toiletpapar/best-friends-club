import React from 'react'
import styled from 'styled-components'

import { onEnter } from '../clientUtils'
import { GameData } from '../../utils/Codenames/CodenamesGame'

const List = styled('ul')`
  list-style-type: none;
  border: 1px solid black;
  height: 400px;
  border-radius: 5px;
  overflow-y: auto;
  padding: 5px;
  background-color: white;
`

interface Highlight {
  active?: boolean;
}

const GameName = styled('li')<Highlight>`
  cursor: pointer;
  ${(props): string => props.active && `background-color: ${props.theme.darkgray}`}
`

interface GameListProps {
  games: GameData[];
  onGameIDSelected: (gameID: string) => void;
  selectedGameID?: string;
}

const GameList = (props: GameListProps): JSX.Element => {
  return (
    <List>
      {
        props.games.length > 0 ? (
          props.games.map((game): React.ReactNode => {
            const selectGame = (): void => props.onGameIDSelected(game.id)

            return (
              <GameName
                tabIndex={0}
                key={game.id}
                active={props.selectedGameID === game.id}
                onClick={selectGame}
                onKeyUp={onEnter(selectGame)}
              >
                {game.name}
              </GameName>
            )
          })
        ) : (
          <GameName>Unable to find any games. Why not create one?</GameName>
        )
      }
    </List>
  )
}

export {
  GameList,
}