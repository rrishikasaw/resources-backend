import { Request, Response } from 'express'
import { User } from '../users/model'
import helpers from '../../utils/helpers'
import jwt from 'jsonwebtoken'

async function postLogin(req: Request, res: Response) {
	try {
		interface Payload {
			email: string
			password: string
		}
		const { email, password } = req.body as Payload

		const user = await User.findOne({email})
		if (!user) {
			return res.status(404).json({ message: `user not found` })
		}

		const hash = helpers.getHash(password)
		if (user.password !== hash) {
			return res.status(401).json({ message: 'authentication failed' })
		}

		const payload = {
			user: user._id,
			hash: hash.slice(-10)
		}
		const token = jwt.sign(payload, process.env.JWT_TOKEN_SECRET!)

		return res.json({ token })
	} catch (error) {
		console.log(error)
		return res.status(500).json({ message: 'server error' })
	}
}

const controllers = {
	postLogin,
}

export default controllers
