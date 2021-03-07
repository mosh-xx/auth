const { jwt, getToken } = require('mosh/knock')

module.exports = {
  jwt: jwt({
    getToken,
    algorithms: ['HS256'],
    secret: process.env.JWT_SECRET_KEY
  })
}
