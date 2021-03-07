const { object, string, assert } = require('mosh/struct')
const { secureToken } = require('mosh/tokens')
const { confirmationMail } = require('../lib/user-mailer')
const database = require('../lib/database')
const mailer = require('../lib/mailer')
const types = require('../lib/types')

async function findUser({ email }) {
  const result = await database.user.findUnique({
    where: { email }
  })

  return result
}

async function deliverNow({ login, email, userId }) {
  const token = secureToken.encode(`${userId},${email},`)
  await mailer.sendMail(confirmationMail({
    user: { login, email },
    token
  }))
}

async function deliverLater({ login, email, userId }) {
  await deliverNow({ login, email, userId })
}

async function sendConfirmationFeature({ email }) {
  assert({ email }, object({ email: string() }))
  assert({ email }, object({ email: types.email() }))
  const account = await findUser({ email })

  if (account && account.unconfirmed_email) {
    await deliverLater({
      userId: account.id,
      login: account.login,
      email: account.unconfirmed_email
    })
  }
}

module.exports = {
  execute: sendConfirmationFeature
}
