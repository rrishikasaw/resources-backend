import { Router } from 'express'
import validations from './validations'
import controllers from './controllers'

const router = Router()

// ! 🌍 POST /auth/login
router.post('/login', validations.postLogin, controllers.postLogin)

module.exports = router

