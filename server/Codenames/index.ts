import * as Codenames from './Codenames'
import { Router } from 'express'

const router = Router()

router.param('id', Codenames.getGame)
router.param('word', Codenames.getWord)

router.post('/', Codenames.createGame)
router.patch('/:id/board/:word', Codenames.flipCard)
router.patch('/:id', Codenames.restartGame)
router.delete('/:id', Codenames.removeGame)

export {
  router
}
