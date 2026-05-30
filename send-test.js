require('dotenv').config();

const { sendTest } = require('./mail');

sendTest({
  to: 'user@example.test',
  subject: 'Test',
  text: 'Hello from Node.js',
})
  .then(() => {
    console.log('Sent');
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
