import { Request, Response } from 'express'
import { IUser, User } from './model'
import helpers from '../../utils/helpers'

async function postUser(req: Request, res: Response) {
	try {
		interface Payload {
			name: string
			email: string
			password: string
		}
		const { name, email, password } = req.body as Payload

		const user = await User.findOne({ email })
		if (user) {
			return res.status(409).json({ message: `user with this email already exist` })
		}

		await User.create({
			name,
			email,
			password: helpers.getHash(password)
		})

		return res.status(201).json({ message: 'user registered successfully' })
	} catch (error) {
		console.log(error)
		return res.status(500).json({ message: 'server error' })
	}
}

async function getUser(req: Request, res: Response) {
	try {
		const user = res.locals.user as IUser

		// @ts-ignore
		user.password = undefined

		return res.json({ user })
	} catch (error) {
		console.log(error)
		return res.status(500).json({ message: 'server error' })
	}
}

const controllers = {
	postUser,
	getUser
}

export default controllers
