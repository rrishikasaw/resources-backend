import cron from 'node-cron';
import helpers from './helpers';

// delete old files every hour
cron.schedule('0 * * * *', () => {
  console.log('⚡ Deleting old files!')
  helpers.deleteOldFiles()
  console.log('✅ done')
});

// update expired resources status
cron.schedule('*/2 * * * *', () => {
  console.log('⚡ Updating expired resources status!')
  helpers.updateExpiredResourceStatus()
  console.log('✅ done')
});

console.log('INFO: '.green + 'Cronjob started!')

export default cron