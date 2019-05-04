import * as Codenames from './Codenames'
import { Router } from 'express'

const router = Router()

router.param('id', Codenames.getGame)
router.param('word', Codenames.getWord)

router.get('/:id/player/board', Codenames.playerView)
router.get('/:id/spymaster/board', Codenames.spymasterView)
router.post('/', Codenames.createGame)
router.patch('/:id/player/board/:word', Codenames.flipCard)
router.patch('/:id/turn', Codenames.passTurn)
router.patch('/:id', Codenames.restartGame)
router.delete('/:id', Codenames.removeGame)

export {
  router
}
