import * as React from 'react'

interface PlayerListProps extends React.PropsWithoutRef<JSX.IntrinsicElements['div']> {
  players: string[];
}

const PlayerList = (props: PlayerListProps): JSX.Element => {
  return (
    <div className={props.className}>
      <h1>Player List</h1>
      <ul>
        {
          props.players.map((player, index): React.ReactNode => {
            return <li key={index}>{player}</li>
          })
        }
      </ul>
    </div>
  )
}

export {
  PlayerList
}