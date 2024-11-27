import { Router } from 'express'
import validations from './validations'
import controllers from './controllers'
import auth from '../../utils/auth'

const router = Router()

// ! 🌍 POST /users
router.post('/', validations.postUser, controllers.postUser)

// ! 🔒 GET /users
router.get('/', auth.authorizeUser, controllers.getUser)

module.exports = router
