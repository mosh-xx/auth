const { object, string, assert } = require('mosh/struct')
const { secureToken } = require('mosh/tokens')
const { authToken } = require('../lib/jwt-sign')
const database = require('../lib/database')

async function findUser({ refreshToken }) {
  const result = await database.user.findUnique({
    where: { refresh_token: refreshToken }
  })

  return result
}

async function setRefreshToken({ userId }) {
  const refreshToken = secureToken.encode(userId)
  await database.user.update({
    where: { id: userId },
    data: {
      refresh_token: refreshToken
    }
  })

  return refreshToken
}

async function jwtRefreshFeature({ refreshToken }) {
  assert({ refreshToken }, object({ refreshToken: string() }))
  const account = await findUser({ refreshToken })

  if (account && account.id) {
    return {
      access_token: authToken.sign({ id: account.id }),
      refresh_token: (await setRefreshToken({
        userId: account.id
      }))
    }
  }

  return false
}

module.exports = {
  setRefreshToken,
  execute: jwtRefreshFeature
}
