const { object, string, assert } = require('mosh/struct')
const { secureToken } = require('mosh/tokens')
const { hashPassword } = require('../lib/secure-password')
const { findUser } = require('./find-user')
const database = require('../lib/database')
const types = require('../lib/types')

async function resetPasswordFeature({ token, newPassword }) {
  assert({ token, newPassword }, object({
    newPassword: string(),
    token: string()
  }))

  assert({ newPassword }, object({ newPassword: types.password() }))

  try {
    const email = secureToken.decode(token, 900000).toString()
    const passwordDigest = hashPassword(newPassword)
    await database.user.update({
      where: { email },
      data: {
        password_digest: passwordDigest
      }
    })

    return true
  } catch {
    return false
  }
}

module.exports = {
  execute: resetPasswordFeature
}
