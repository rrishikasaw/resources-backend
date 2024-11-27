import { NextFunction, Request, Response } from 'express'
import { validate } from 'super-easy-validator'

function postUser(req: Request, res: Response, next: NextFunction) {
	try {
		const rules = {
			name: 'fullname',
			email: 'email',
			password: 'string|min:6|max:15'
		}
		const { errors } = validate(rules, req.body)
		if (errors) {
			return res.status(400).json({ message: errors[0] })
		}

		return next()
	} catch (error) {
		console.log(error)
		return res.status(500).json({ message: 'server error' })
	}
}

const validations = {
	postUser
}

export default validations
