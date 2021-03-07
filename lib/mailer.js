const { createTransport } = require('mosh/mailer')

module.exports = createTransport({
  host: process.env.MOSH_MAILER_HOST,
  port: process.env.MOSH_MAILER_PORT,
  auth: {
    user: process.env.MOSH_MAILER_USERNAME,
    pass: process.env.MOSH_MAILER_PASSWORD
  }
})
