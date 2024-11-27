import multer from 'multer'

export const FileUploader = multer({
	fileFilter: (req, file, cb) => {
		return cb(null, true)
	},
	limits: {
		fieldSize: 100 * 1024 * 1024,
	},
	storage: multer.diskStorage({
		destination: './uploads',
		filename: (req, file, cb) => {
			const suffix = Date.now() + '-' + `${Math.random()}`.substring(2)
			return cb(null, suffix + '-' + file.originalname)
		},
	}),
})
