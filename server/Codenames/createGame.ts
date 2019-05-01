import express from 'express'
import { CodenamesGame } from '../../utils/Codenames/index'

const games: CodenamesGame[] = []

const createGame = (req: express.Request, res: express.Response): void => {
  const game = new CodenamesGame()
  games.push(game)
  res.json(game.getState())
}

export {
  createGame
}