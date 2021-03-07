const mosh = require('mosh')
const helmet = require('mosh/helmet')
const morgan = require('mosh/morgan')
const prettyError = require('mosh/pretty-error')
const { createRouter } = require('mosh/router')
const bodyParser = require('mosh/body-parser')
const requestId = require('mosh/request-id')
const features = require('../features')
const knock = require('../lib/knock')
const errorHandler = require('../lib/error-handler')

function routes() {
  return createRouter()
    .post('/login', features.login)
    .post('/account', features.createAccount)
    .put('/email/confirm', features.verifyAccount)
    .put('/reset-password', features.resetPassword)
    .put('/user/change-login', knock.jwt, features.changeLogin)
    .put('/user/change-password', knock.jwt, features.changePassword)
    .post('/user/confirm-password', knock.jwt, features.confirmPassword)
    .put('/user/close-account', knock.jwt, features.closeAccount)
    .post('/send-confirmation', features.sendConfirmation)
    .post('/send-reset-password', features.sendResetPassword)
    .post('/refresh-token', features.refreshToken)
    .get('/user', knock.jwt, features.currentUser)
    .delete('/logout', knock.jwt, features.logout)
}

mosh.use(bodyParser.json())
mosh.use(morgan('dev'))
mosh.use(requestId())
mosh.use(helmet())
mosh.use(routes())
mosh.use(prettyError())
mosh.use(errorHandler())

process.env.VERCEL_ENV
  ? mosh.bootstrap()
  : mosh.start()

module.exports = mosh.application
