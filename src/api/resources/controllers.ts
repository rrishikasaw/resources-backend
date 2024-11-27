import { Request, Response } from 'express'
import { IUser } from '../users/model'
import { Resource } from './model'
import helpers from '../../utils/helpers'
import { IFiles } from '../../utils/types'

async function getResources(req: Request, res: Response) {
	try {
		interface Payload {
			limit?: string | number
			page?: string | number
			status?: 'active' | 'expired'
		}

		const user = res.locals.user as IUser
		let { limit = '10', page = '1', status } = req.query as Payload
		limit = +limit
		page = +page

		const match: Record<string, any> = { user: user._id }
		if (status) {
			match.status = status
		}

		let resources = await Resource.find(match)
			.sort({ createdAt: -1 })
			.skip((page - 1) * limit)
			.limit(limit)
		const count = await Resource.countDocuments(match)

		return res.json({ resources, count })
	} catch (error) {
		console.log(error)
		return res.status(500).json({ message: 'server error' })
	}
}

async function getResource(req: Request, res: Response) {
	try {
		const id = req.params.id as string

		const resource = await Resource.findById(id)
		if (!resource) {
			return res.status(404).json({ message: 'resource not found' })
		}

		if(resource.status === 'expired') {
			return res.status(410).json({message: 'link expired'})
		}

		return res.redirect(resource.link ?? resource.url)
	} catch (error) {
		console.log(error)
		return res.status(500).json({ message: 'server error' })
	}
}

async function postResource(req: Request, res: Response) {
	try {
		interface Payload {
			link?: string
			expiry: string
		}

		const { link, expiry } = req.body as Payload
		const user = res.locals.user as IUser
		const file = (req.files as IFiles)?.file?.[0]
		let url: string = ''

		const resource = new Resource({
			user: user._id,
			file: file?.filename ?? undefined,
			link,
			expiry: new Date(expiry),
		})

		if(link) {
			url = process.env.HOST + `/resources/${resource._id}`
		} else if(file) {
			await helpers.uploadFile(file, `files/${file.filename}`)
			let _url = await helpers.getS3FileUrl(`files/${file.filename}`, resource.expiry)
			if(!_url) {
				return res.status(500).json({message: 'unable to create file link, please try again later'})
			}
			url = _url
		}

		resource.url = url
		await resource.save()

		return res.status(201).json({ resource })
	} catch (error) {
		console.log(error)
		return res.status(500).json({ message: 'server error' })
	}
}

async function deleteResource(req: Request, res: Response) {
	try {
		const id = req.params.id as string
		const user = res.locals.user as IUser

		const resource = await Resource.findById(id)
		if (!resource) {
			return res.status(404).json({ message: 'resource not found' })
		}

		if (`${resource.user}` !== `${user._id}`) {
			return res.status(403).json({ message: 'permission denied' })
		}

		if (resource.file) {
			await helpers.deleteS3File(resource.file)
		}

		await resource.deleteOne()

		return res.json({ message: 'resource deleted successfully' })
	} catch (error) {
		console.log(error)
		return res.status(500).json({ message: 'server error' })
	}
}

const controllers = {
	getResources,
	getResource,
	postResource,
	deleteResource
}

export default controllers
