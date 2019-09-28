import express from 'express'
import { CodenamesGame } from '../../utils/Codenames/index'
import { GameData } from '../../utils/Codenames/CodenamesGame'
import { wsManager, WebSocketServerWrapper } from '../WebSocket'
import { Actions, createUserLeave, UserJoinAction, ChatAction } from '../../utils/Codenames/actions'

const MAX_GAMES = 50

interface BFCSocket {
  bfcUser: string;
}

interface CodenameRequest extends express.Request {
  game?: CodenamesGame;
  word?: string;
}

const games: CodenamesGame[] = []

const getGames = (req: express.Request, res: express.Response): void => {
  res.json(games.map((game): GameData => game.getState()))
  return
}

const createGame = (req: express.Request, res: express.Response): void => {
  if (!req.body.name) {
    res.status(400).send('No game name provided')
    return
  }

  if (games.length < MAX_GAMES) {
    const game = new CodenamesGame(req.body.name)
    const wss = new WebSocketServerWrapper<BFCSocket>(wsManager.createWebSocketServer(`/codenames/socket/${game.getState().id}`))

    // Setup error handling
    wss.onSocketConnectionError((err): void => {
      console.error(err)
    })

    // Setup connection message
    wss.onSocketConnection((socket): void => {
      socket.bfcUser = 'Fresh Onion'
    })

    // Setup user entrance
    wss.onAction<UserJoinAction>(Actions.USER_JOIN, (action, socket): void => {
      socket.bfcUser = action.user
      wss.broadcastAction(action)
    })

    // Setup chat
    wss.onAction<ChatAction>(Actions.CHAT_MESSAGE, wss.broadcastAction)

    // Setup disconnection/exit messages
    wss.onSocketClose((socket): () => void => (): void => {
      wss.broadcastAction(createUserLeave(socket.bfcUser))
    })

    games.push(game)
    res.json(game.getState())
    return
  } else {
    res.status(403).send('Too many games')
    return
  }
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

const passTurn = (req: CodenameRequest, res: express.Response): void => {
  res.json(req.game.passTurn().getState())
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
    wsManager.removeWebSocketServer(`/codenames/socket/${req.game.getState().id}`)
  }

  res.sendStatus(200)
}

export {
  createGame,
  getGame,
  getGames,
  spymasterView,
  playerView,
  getWord,
  passTurn,
  flipCard,
  restartGame,
  removeGame
}