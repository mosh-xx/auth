const { object, string, assert } = require('mosh/struct')
const { secureToken } = require('mosh/tokens')
const database = require('../lib/database')

async function verifyAccountFeature({ token }) {
  assert({ token }, object({ token: string() }))

  try {
    const [
      userId,
      email,
      unconfirmedEmail
    ] = secureToken.decode(token, 900000).toString().split(',')

    await database.user.update({
      where: { id: userId },
      data: {
        email,
        confirmed_at: new Date(),
        unconfirmed_email: unconfirmedEmail
      }
    })

    return true
  } catch {
    return false
  }
}

module.exports = {
  execute: verifyAccountFeature
}
