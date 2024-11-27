import { Connection } from 'mongoose'
import cron from './cron-jobs'

const constants = {
  cron: undefined as unknown as typeof cron,
  db: undefined as unknown as Connection,
};

export default constants