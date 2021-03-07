const database = require('../lib/database')

async function findUser({ userId }) {
  const result = await database.user.findUnique({
    rejectOnNotFound: true,
    where: { id: userId }
  })

  return result
}

async function findUserFeature({ userId }) {
  const {
    unconfirmed_email,
    password_digest,
    refresh_token,
    inviter_id,
    code,
    ...account
  } = await findUser({ userId })

  return account
}

module.exports = {
  findUser,
  execute: findUserFeature
}
