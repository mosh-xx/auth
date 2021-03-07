const mustache = require('mustache')
const readFile = require('./read-file')
const templatePath = `${__dirname}/views/mailers`
const defaultLayout = {
  html: readFile(`${templatePath}/layout.html.mustache`),
  text: readFile(`${templatePath}/layout.text.mustache`)
}

function render(template, args) {
  const templateContent = {
    html: readFile(`${templatePath}/${template}.html.mustache`),
    text: readFile(`${templatePath}/${template}.text.mustache`)
  }

  return {
    html: mustache.render(defaultLayout.html, args, { content: templateContent.html }),
    text: mustache.render(defaultLayout.text, args, { content: templateContent.text })
  }
}

module.exports = { render }
