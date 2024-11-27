import { Request, Response, NextFunction } from 'express'
import { MulterError } from 'multer'
import color from 'colors'
import { connect } from 'mongoose'
import { S3Client } from '@aws-sdk/client-s3'

// error handler
const errorHandler = (error: any, _req: Request, res: Response, _next: NextFunction) => {
	console.log(error)
	if (!(error instanceof MulterError)) {
		return res.status(500).json({ message: 'server error' })
	}
	if (error.code === 'LIMIT_FILE_SIZE') {
		return res.status(413).json({ message: 'file size too large' })
	}
	return res.status(400).json({ message: error.message })
}

// mongoose connection
const mongooseConnection = connect(process.env.MONGODB!, {
	dbName: process.env.DATABASE!
})

// AWS S3
const S3 = new S3Client({
	region: process.env.S3_REGION!,
	credentials: {
		accessKeyId: process.env.S3_ACCESS_KEY_ID!,
		secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!
	}
})

const config = {
	errorHandler,
	color,
	mongooseConnection,
	S3
}

export default config
