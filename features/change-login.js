const { object, string, assert } = require('mosh/struct')
const ValidationError = require('../lib/validation-error')
const database = require('../lib/database')
const types = require('../lib/types')

async function ensureLogin({ login, userId }) {
  const result = await database.user.findMany({
    where: { id: { not: userId }, login }
  })

  if (result[0]) {
    throw new ValidationError('Login already exists')
  }
}

async function changeLoginFeature({ login, userId }) {
  assert({ login }, object({ login: string() }))
  assert({ login }, object({ login: types.login() }))

  await ensureLogin({ login, userId })
  await database.user.update({
    where: { id: userId },
    data: { login }
  })
}

module.exports = {
  execute: changeLoginFeature
}
