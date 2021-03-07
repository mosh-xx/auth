const { object, string, assert } = require('mosh/struct')
const { secureToken } = require('mosh/tokens')
const { resetPasswordMail } = require('../lib/user-mailer')
const database = require('../lib/database')
const mailer = require('../lib/mailer')
const types = require('../lib/types')

async function findUser({ email }) {
  const result = await database.user.findUnique({
    where: { email }
  })

  return result
}

async function deliverNow({ login, email }) {
  const token = secureToken.encode(email)
  await mailer.sendMail(resetPasswordMail({
    user: { login, email },
    token
  }))
}

async function deliverLater({ login, email }) {
  await deliverNow({ login, email })
}

async function sendResetPasswordFeature({ email }) {
  assert({ email }, object({ email: string() }))
  assert({ email }, object({ email: types.email() }))
  const account = await findUser({ email })

  if (account && account.confirmed_at) {
    await deliverLater({ login: account.login, email })
  }
}

module.exports = {
  execute: sendResetPasswordFeature
}
