import { createGame } from './createGame'
import { Router } from 'express'

const router = Router()

router.post('/', createGame)

export {
  router
}
