const { readFileSync } = require('fs')

function readFile(path) {
  return readFileSync(path, 'utf-8')
}

module.exports = readFile
