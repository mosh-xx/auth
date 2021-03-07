const random = require('mosh/helpers/random')
const database = require('../lib/database')

async function logoutFeature({ userId }) {
  const refreshToken = random.alphanumeric(32)
  await database.user.update({
    where: { id: userId },
    data: {
      refresh_token: refreshToken
    }
  })
}

module.exports = {
  execute: logoutFeature
}
