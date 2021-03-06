import * as React from 'react'

import { GameData, Team, GameState } from '../../utils/Codenames/CodenamesGame'

interface ScoreboardProps extends React.PropsWithoutRef<JSX.IntrinsicElements['div']> {
  isSpymaster: boolean;
  game: GameData;
}

const Scoreboard = (props: ScoreboardProps): JSX.Element => {
  return (
    <div className={props.className}>
      <h1>{props.game.name}</h1>
      <h3>{props.isSpymaster ? 'Spymaster' : 'Field Operative'}</h3>
      <div>Current Turn: {props.game.currentTurn === Team.FIRSTTEAM ? 'Red Team' : 'Blue Team'}</div>
      <div>Red Team: {props.game.score.firstTeamScore}</div>
      <div>Blue Team: {props.game.score.secondTeamScore}</div>
      {
        props.game.gameState === GameState.FIRSTTEAMWIN ? 'Red Team Wins' : props.game.gameState === GameState.SECONDTEAMWIN ? 'Blue Team Wins' : null
      }
    </div>
  )
}

export {
  Scoreboard
}
