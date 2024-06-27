const cron = require('node-cron');
cron.schedule('* * * * *', () => {
    // Do something every minute
});
