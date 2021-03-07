const statuses = require('mosh/statuses')

function errorHandler(error, request, response, next) {
  if (error.name === 'UnauthorizedError') {
    return response.status(401).json({
      message: error.message
    })
  }

  if (error.name === 'ValidationError') {
    return response.status(422).json({
      message: error.message
    })
  }

  if (error.name === 'NotFoundError') {
    return response.status(404).json({
      message: error.message
    })
  }

  if (error.name === 'StructError') {
    return response.status(422).json({
      message: error.message
    })
  }

  return response.status(500).json({
    message: statuses[500]
  })
}

module.exports = () => errorHandler
