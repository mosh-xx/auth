const renderer = require('./renderer')
const MOSH_MAILER_FROM = process.env.MOSH_MAILER_FROM

function welcomeMail({ user }) {
  const subject = '欢迎来到 mosh-xx!'
  const { html, text } = renderer.render('welcome', {
    login: user.login
  })

  return {
    from: MOSH_MAILER_FROM,
    to: user.email,
    subject,
    html,
    text
  }
}

function confirmationMail({ user, token }) {
  const subject = '邮箱确认信息'
  const { html, text } = renderer.render('confirmation', {
    login: user.login,
    token
  })

  return {
    from: MOSH_MAILER_FROM,
    to: user.email,
    subject,
    html,
    text
  }
}

function resetPasswordMail({ user, token }) {
  const subject = '重置密码信息'
  const { html, text } = renderer.render('reset-password', {
    login: user.login,
    token
  })

  return {
    from: MOSH_MAILER_FROM,
    to: user.email,
    subject,
    html,
    text
  }
}

module.exports = {
  welcomeMail,
  confirmationMail,
  resetPasswordMail
}
