import express from 'express'
import { CodenamesGame } from '../../utils/Codenames/index'

interface CodenameRequest extends express.Request {
  game?: CodenamesGame;
  word?: string;
}

const games: CodenamesGame[] = []

const createGame = (req: express.Request, res: express.Response): void => {
  const game = new CodenamesGame()
  games.push(game)
  res.json(game.getState())
}

const getGame = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
  const { id } = req.params
  const game = games.find((game): boolean => game.getState().id === id)

  if (game) {
    (req as CodenameRequest).game = game
    next()
  } else {
    res.sendStatus(404)
  }
}

const getWord = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
  const { word } = req.params

  if (word) {
    (req as CodenameRequest).word = word
    next()
  } else {
    res.sendStatus(404)
  }
}

const playerView = (req: CodenameRequest, res: express.Response): void => {
  res.json(req.game.getState())
}

const spymasterView = (req: CodenameRequest, res: express.Response): void => {
  res.json(req.game.getSpymasterState())
}

const flipCard = (req: CodenameRequest, res: express.Response): void => {
  res.json(req.game.revealCard(req.word).getState())
}

const restartGame = (req: CodenameRequest, res: express.Response): void => {
  res.json(req.game.setupGame().getState())
}

const removeGame = (req: CodenameRequest, res: express.Response): void => {
  const index = games.findIndex((game): boolean => game.getState().id === req.game.getState().id)

  if (index) {
    games.splice(index, 1)
  }

  res.sendStatus(200)
}

export {
  createGame,
  getGame,
  spymasterView,
  playerView,
  getWord,
  flipCard,
  restartGame,
  removeGame
}