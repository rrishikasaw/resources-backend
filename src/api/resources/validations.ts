import { NextFunction, Request, Response } from 'express'
import { validate } from 'super-easy-validator'
import { IFiles } from '../../utils/types'

function getResources(req: Request, res: Response, next: NextFunction) {
	try {
    const rules = {
      limit: 'optional|string|natural',
      page: 'optional|string|natural',
      status: 'optional|enums:active,inactive',
    }
		const { errors } = validate(rules, req.query)
		if (errors) {
			return res.status(400).json({ message: errors[0] })
		}

		return next()
	} catch (error) {
		console.log(error)
		return res.status(500).json({ message: 'server error' })
	}
}

function getResource(req: Request, res: Response, next: NextFunction) {
	try {
		const { errors } = validate({id: 'mongoid'}, req.params)
		if (errors) {
			return res.status(400).json({ message: errors[0] })
		}

		return next()
	} catch (error) {
		console.log(error)
		return res.status(500).json({ message: 'server error' })
	}
}

function postResource(req: Request, res: Response, next: NextFunction) {
	try {
    const rules = {
      link: 'optional|url',
      expiry: 'date',
    }
		const { errors } = validate(rules, req.body)
		if (errors) {
			return res.status(400).json({ message: errors[0] })
		}

    const file = (req.files as IFiles)?.file?.[0]

    if((!file && !req.body.link) || (file && req.body.link)) {
      return res.status(400).json({message: 'exactly one of file/link is required'})
    }

		return next()
	} catch (error) {
		console.log(error)
		return res.status(500).json({ message: 'server error' })
	}
}

function deleteResource(req: Request, res: Response, next: NextFunction) {
	try {
		const { errors } = validate({id: 'mongoid'}, req.params)
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
  getResources,
  getResource,
	postResource,
  deleteResource,
}

export default validations
