const asyncHandler = require('mosh/async-handler')
const loginFeature = require('./login')
const createAccountFeature = require('./create-account')
const verifyAccountFeature = require('./verify-account')
const resetPasswordFeature = require('./reset-password')
const sendConfirmationFeature = require('./send-confirmation')
const sendResetPasswordFeature = require('./send-reset-password')
const changeLoginFeature = require('./change-login')
const changePasswordFeature = require('./change-password')
const confirmPasswordFeature = require('./confirm-password')
const closeAccountFeature = require('./close-account')
const jwtRefreshFeature = require('./jwt-refresh')
const findUserFeature = require('./find-user')
const logoutFeature = require('./logout')

async function loginHandler(request, response) {
  const { login, email, password } = request.body
  const result = await loginFeature.execute({ login, email, password })

  return result
    ? response.json(result)
    : response.status(401).json({ message: 'Invalid credentials' })
}

async function createAccountHandler(request, response) {
  const { login, email, password } = request.body
  const result = await createAccountFeature.execute({ login, email, password })

  return response.status(201).json({ id: result.id })
}

async function verifyAccountHandler(request, response) {
  const { token } = request.body
  const result = await verifyAccountFeature.execute({ token })

  return result
    ? response.end()
    : response.status(400).end()
}

async function resetPasswordHandler(request, response) {
  const { token, newPassword } = request.body
  const result = await resetPasswordFeature.execute({ token, newPassword })

  return result
    ? response.end()
    : response.status(400).end()
}

async function sendConfirmationHandler(request, response) {
  const { email } = request.body
  await sendConfirmationFeature.execute({ email })

  return response.status(204).end()
}

async function sendResetPasswordHandler(request, response) {
  const { email } = request.body
  await sendResetPasswordFeature.execute({ email })

  return response.status(204).end()
}

async function changeLoginHandler(request, response) {
  const { login } = request.body
  await changeLoginFeature.execute({
    userId: request.user.id,
    login
  })

  return response.status(204).end()
}

async function changePasswordHandler(request, response) {
  const { newPassword, currentPassword } = request.body
  const result = await changePasswordFeature.execute({
    userId: request.user.id,
    currentPassword,
    newPassword
  })

  return result
    ? response.status(204).end()
    : response.status(422).json({ message: 'Invalid currentPassword' })
}

async function confirmPasswordHandler(request, response) {
  const { currentPassword } = request.body
  const result = await confirmPasswordFeature.execute({
    userId: request.user.id,
    currentPassword
  })

  return result
    ? response.end()
    : response.status(400).end()
}

async function closeAccountHandler(request, response) {
  await closeAccountFeature.execute({
    userId: request.user.id
  })

  return response.status(204).end()
}

async function refreshTokenHandler(request, response) {
  const { refreshToken }= request.body
  const result = await jwtRefreshFeature.execute({ refreshToken })

  return result
    ? response.json(result)
    : response.status(422).json({ message: 'Invalid refreshToken' })
}

async function currentUserHandler(request, response) {
  const result = await findUserFeature.execute({
    userId: request.user.id
  })

  return response.json(result)
}

async function logoutHandler(request, response) {
  await logoutFeature.execute({
    userId: request.user.id
  })

  return response.status(204).end()
}

module.exports = {
  login: asyncHandler(loginHandler),
  createAccount: asyncHandler(createAccountHandler),
  verifyAccount: asyncHandler(verifyAccountHandler),
  resetPassword: asyncHandler(resetPasswordHandler),
  sendConfirmation: asyncHandler(sendConfirmationHandler),
  sendResetPassword: asyncHandler(sendResetPasswordHandler),
  changeLogin: asyncHandler(changeLoginHandler),
  changePassword: asyncHandler(changePasswordHandler),
  confirmPassword: asyncHandler(confirmPasswordHandler),
  closeAccount: asyncHandler(closeAccountHandler),
  refreshToken: asyncHandler(refreshTokenHandler),
  currentUser: asyncHandler(currentUserHandler),
  logout: asyncHandler(logoutHandler)
}
