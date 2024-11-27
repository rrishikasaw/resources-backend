import fs from 'fs'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { type IUser } from '../api/users/model'
import config from './config'
import { Resource } from '../api/resources/model'

function deleteOldFiles(directory = 'uploads', maxAgeInMinutes = 5) {
	try {
		const currentTime = new Date()
		const maxAge = maxAgeInMinutes * 60 * 1000

		const files = fs.readdirSync(directory)
		for (const file of files) {
			const filePath = directory + '/' + file
			const stats = fs.statSync(filePath)
			const fileAge = currentTime.getTime() - stats.birthtime.getTime()

			if (fileAge > maxAge) {
				fs.unlinkSync(filePath)
				console.log(`Deleted: ${filePath}`)
			}
		}
	} catch (err) {
		console.error(err)
	}
}

function getHash(password: string) {
	const salt = process.env.PASSWORD_SALT!
	const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512')
	return hash.toString('hex')
}

function getToken(user: IUser) {
	const payload = {
		user: user._id,
		hash: user.password.slice(-10)
	}
	const token = jwt.sign(payload, process.env.JWT_TOKEN_SECRET!)

	return { token }
}

function deleteFile(file: Express.Multer.File | string) {
	try {
		if (typeof file === 'string') {
			fs.unlinkSync(file)
			console.log(`File ${file} deleted!`)
		} else {
			fs.unlinkSync(file.path)
			console.log(`File ${file.filename} deleted!`)
		}
	} catch {}
}

async function uploadFile(file: Express.Multer.File | Buffer, cloudFilePath: string) {
	try {
		// @ts-ignore
		const fileBuffer = file instanceof Buffer ? file : await fs.promises.readFile(file.path)

		const command = new PutObjectCommand({
			Bucket: process.env.S3_BUCKET!,
			Key: cloudFilePath,
			Body: fileBuffer
		})

		await config.S3.send(command)
	} catch (error) {
		console.log(error)
	}
}

async function getTemporaryFileUploadUrl(fileType: string, cloudFilePath: string): Promise<string | undefined> {
	try {
		const command = new PutObjectCommand({
			Bucket: process.env.S3_BUCKET!,
			Key: cloudFilePath,
			ContentType: fileType
		})

		const url = await getSignedUrl(config.S3, command, { expiresIn: 60 * 60 })
		return url
	} catch (error) {
		console.log(error)
	}
}

async function deleteS3File(path: string) {
	const command = new DeleteObjectCommand({
		Bucket: process.env.S3_BUCKET!,
		Key: path
	})

	try {
		await config.S3.send(command)
		console.log(`File deleted successfully.`)
	} catch (error) {
		console.log(error)
	}
}

async function getS3FileUrl(path: string, expiry: Date): Promise<string | undefined> {
	try {
		const command = new GetObjectCommand({
			Bucket: process.env.S3_BUCKET!,
			Key: path,
		})

		let now = new Date()
		let expiresIn = Math.floor((expiry.getTime() - now.getTime()) / 1000)
		const url = await getSignedUrl(config.S3, command, { expiresIn })
		return url
	} catch (error) {
		console.log(error)
	}
}

async function updateExpiredResourceStatus() {
	try {
		const result = await Resource.updateMany(
			{
				status: 'active',
				expiry: { $lt: new Date() }
			},
			{ status: 'expired' }
		)
		if(result.modifiedCount) {
			console.log(`${result.modifiedCount} resources are marked as expired!`)
		}
	} catch (error) {
		console.log(error)
	}
}

const helpers = {
	deleteOldFiles,
	getHash,
	getToken,
	deleteFile,
	uploadFile,
	getTemporaryFileUploadUrl,
	deleteS3File,
	getS3FileUrl,
	updateExpiredResourceStatus
}

export default helpers
