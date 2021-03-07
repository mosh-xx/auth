const database = require('../lib/database')

async function closeAccountFeature({ userId }) {
  await database.user.update({
    where: { id: userId },
    data: { closed_at: new Date() }
  })
}

module.exports = {
  execute: closeAccountFeature
}
