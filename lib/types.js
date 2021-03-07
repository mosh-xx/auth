const isStrongPassword = require('validator/lib/isStrongPassword')
const isAlphanumeric = require('validator/lib/isAlphanumeric').default
const isEmail = require('validator/lib/isEmail')
const isSlug = require('validator/lib/isSlug')
const { define } = require('mosh/struct')

function isLogin(value) {
  if (/^[\-]+/.test(value)) { return false }
  if (/[\-]+$/.test(value)) { return false }

  return isAlphanumeric(value.replace(/[\-]+/g, ''))
}

function login()    { return define('Login', isLogin) }
function email()    { return define('Email', isEmail) }
function password() { return define('StrongPassword', isStrongPassword) }
function slug()     { return define('Slug', isSlug) }

module.exports = {
  login,
  email,
  password,
  slug
}
