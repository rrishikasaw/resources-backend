import { Router } from 'express'
import validations from './validations'
import controllers from './controllers'
import auth from '../../utils/auth'
import { FileUploader } from '../../utils/uploaders'

const router = Router()

// ! 🔒 GET /resources
router.get('/', auth.authorizeUser, validations.getResources, controllers.getResources)

// ! 🌍 GET /resources/:id
router.get('/:id', validations.getResource, controllers.getResource)

// ! 🔒 POST /resources
router.post(
	'/',
	auth.authorizeUser,
	FileUploader.fields([{ name: 'file', maxCount: 1 }]),
	validations.postResource,
	controllers.postResource
)

// ! 🔒 DELETE /resources/:id
router.delete('/:id', auth.authorizeUser, validations.deleteResource, controllers.deleteResource)

module.exports = router
