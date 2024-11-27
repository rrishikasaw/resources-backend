require('dotenv').config()
import config from './src/utils/config'

import express from 'express'
import cors from 'cors'
import cron from './src/utils/cron-jobs'
import constants from './src/utils/constants'
import morgan from 'morgan'

const app = express()
app.use(express.json())
app.use(cors())
app.use(morgan('dev'))

app.all('/api', (_, res) => res.json({ message: 'Server running...⚡️⚡️⚡️' }))

app.use('/api/users', require('./src/api/users/routes'))
app.use('/api/auth', require('./src/api/auth/routes'))
app.use('/api/resources', require('./src/api/resources/routes'))

// error handler
app.use(config.errorHandler)
app.use((req, res) => res.status(405).json({ message: 'route not implemented' }))

app.listen(process.env.PORT, async () => {
	console.log('INFO: '.green + 'Server started!')

	// connecting mongodb
	const client = await config.mongooseConnection
	constants.db = client.connection
	console.log('INFO: '.green + 'Atlas connected!')
})

constants.cron = cron
