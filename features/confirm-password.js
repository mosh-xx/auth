const { string, object, assert } = require('mosh/struct')
const { verifyPassword } = require('../lib/secure-password')
const { findUser } = require('./find-user')
const types = require('../lib/types')

async function confirmPasswordFeature({ userId, currentPassword }) {
  assert({ currentPassword }, object({ currentPassword: string() }))
  assert({ currentPassword }, object({ currentPassword: types.password() }))

  const account = await findUser({ userId })
  return verifyPassword(currentPassword, account.password_digest)
}

module.exports = {
  execute: confirmPasswordFeature
}
