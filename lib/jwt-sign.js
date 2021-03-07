const { authToken } = require('mosh/tokens')

function sign(payload, options) {
  return authToken.sign(payload, {
    expiresIn: '1h',
    ...options
  })
}

module.exports = {
  authToken: {
    sign
  }
}
