const { string, object, assert } = require('mosh/struct')
const { hashPassword, verifyPassword } = require('../lib/secure-password')
const { findUser } = require('./find-user')
const database = require('../lib/database')
const types = require('../lib/types')

async function changePasswordFeature({ userId, newPassword, currentPassword }) {
  assert({ newPassword, currentPassword }, object({
    currentPassword: string(),
    newPassword: string()
  }))

  assert({ newPassword }, object({ newPassword: types.password() }))
  const account = await findUser({ userId })

  if (verifyPassword(currentPassword, account.password_digest)) {
    const passwordDigest = hashPassword(newPassword)
    await database.user.update({
      where: { id: userId },
      data: {
        password_digest: passwordDigest
      }
    })

    return true
  }

  return false
}

module.exports = {
  execute: changePasswordFeature
}
