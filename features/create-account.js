const { object, string, assert } = require('mosh/struct')
const random = require('mosh/helpers/random')
const { welcomeMail } = require('../lib/user-mailer')
const ValidationError = require('../lib/validation-error')
const { hashPassword } = require('../lib/secure-password')
const database = require('../lib/database')
const mailer = require('../lib/mailer')
const types = require('../lib/types')

async function deliverNow({ login, email }) {
  await mailer.sendMail(welcomeMail({
    user: { login, email }
  }))
}

async function deliverLater({ login, email }) {
  await deliverNow({ login, email })
}

async function ensureLoginOrEmail({ login, email }) {
  const result = await database.user.findMany({
    where: { OR: [ { login }, { email } ] }
  })

  if (result[0]) {
    throw new ValidationError('Account already exists')
  }
}

async function createAccountFeature({ login, email, password }) {
  assert({ login, email, password }, object({
    login: string(),
    email: string(),
    password: string()
  }))

  assert({ login, email, password }, object({
    login: types.login(),
    email: types.email(),
    password: types.password()
  }))

  await ensureLoginOrEmail({ login, email })
  const code = random.alphanumeric(6)
  const refreshToken = random.alphanumeric(32)
  const passwordDigest = hashPassword(password)
  const account = await database.user.create({
    data: {
      code,
      login,
      email,
      unconfirmed_email: email,
      refresh_token: refreshToken,
      password_digest: passwordDigest
    }
  })

  await deliverLater({ login, email })
  return account
}

module.exports = {
  execute: createAccountFeature
}
