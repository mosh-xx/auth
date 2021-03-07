const { object, string, optional, assert } = require('mosh/struct')
const { verifyPassword } = require('../lib/secure-password')
const { authToken } = require('../lib/jwt-sign')
const database = require('../lib/database')

async function findUserByLoginOrEmail({ login, email }) {
  const result = await database.user.findMany({
    where: {
      OR: [
        {
          login: { equals: login, mode: 'insensitive' }
        },
        {
          email: { equals: email, mode: 'insensitive' }
        }
      ]
    }
  })

  return result[0] || null
}

async function loginFeature({ login, email, password }) {
  assert({ login, email, password }, object({
    login: optional(string()),
    email: optional(string()),
    password: string()
  }))

  const account = await findUserByLoginOrEmail({ login, email })

  if (account && verifyPassword(password, account.password_digest)) {
    return {
      access_token: authToken.sign({ id: account.id }),
      refresh_token: account.refresh_token
    }
  }

  return false
}

module.exports = {
  execute: loginFeature
}
