import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../api/users/model'

async function authorizeUser(req: Request, res: Response, next: NextFunction) {
	try {
		const authorization = req.headers.authorization
		if (!authorization || !authorization.startsWith('Bearer ')) {
			return res.status(401).json({ message: 'authorization failed' })
		}

		type Payload = { user: string; hash: string }
		const token = authorization.slice('Bearer '.length)
		const { user: userId } = jwt.verify(token, process.env.JWT_TOKEN_SECRET!) as Payload

		const user = await User.findById(userId)
		if (!user) {
			return res.status(404).json({ message: 'user not found' })
		}

		res.locals.user = user
		res.locals.token = token

		return next()
	} catch (error) {
		return res.status(401).json({ message: 'authorization failed' })
	}
}

const auth = {
	authorizeUser
}

export default auth
