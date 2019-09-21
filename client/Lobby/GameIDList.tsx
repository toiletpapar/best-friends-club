import React from 'react'
import styled from 'styled-components'

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

const GameID = styled('li')<Highlight>`
  cursor: pointer;
  ${(props): string => props.active && `background-color: ${props.theme.darkgray}`}
`

interface GameIDListProps {
  gameIDs: string[];
  onGameIDSelected: (gameID: string) => void;
  selectedGameID?: string;
}

const GameIDList = (props: GameIDListProps): JSX.Element => {
  return (
    <List>
      {
        props.gameIDs.length > 0 ? (
          props.gameIDs.map((gameID): React.ReactNode => {
            return (
              <GameID key={gameID} active={props.selectedGameID === gameID} onClick={(): void => props.onGameIDSelected(gameID)}>{gameID}</GameID>
            )
          })
        ) : (
          <GameID>Unable to find any games. Why not create one?</GameID>
        )
      }
    </List>
  )
}

export {
  GameIDList,
}