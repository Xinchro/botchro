const fs = require('fs')
const path = require('path')
const assetsPath = path.join(__dirname, '..', 'assets')
const { getUserCharacterConfig } = require('../utils/index.js')

module.exports.hendzHandler = async (interaction) => {
  switch(interaction.options.getSubcommand()) {
    case 'show':
      return { content: await this.showHend(interaction), ephemeral: true }
    case 'hide':
      return { content: await this.hideHend(interaction), ephemeral: true }
    case 'peek':
      return { content: await this.getHendz(interaction), ephemeral: false }
    case 'reset':
      return { content: await this.resetHendz(interaction), ephemeral: true }
    default:
      return 'wat'
  }
}

module.exports.showHend = async (interaction) => {
  const hendz = await loadHendz()
  await saveHendz(hendz.add(interaction.user.id))
  return 'You\'ve hendz\'d'
}

module.exports.hideHend = async (interaction) => {
  const hendz = await loadHendz()
  const username = interaction.user.username
  const character = await getCharacter(interaction.user.id)
  const userObject = {
    username,
    character
  }
  hendz.delete(JSON.stringify(userObject))
  await saveHendz(hendz)
  return 'You\'ve unhendz\'d'
}

module.exports.getHendz = async () => {
  const hendzArray = Array.from(await loadHendz())
  return `People who have hendz'd: ${hendzArray.length > 0 ? hendzArray.join(', ') : 'No-one. Very sad. :('}`
}

module.exports.resetHendz = async () => {
  await saveHendz(new Set())
  return 'Hendz have been reset'
}

async function getCharacter(userId) {
  const config = await getUserCharacterConfig(userId)
  return config
}

function saveHendz(user) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path.join(assetsPath, 'data/hendz.json'), JSON.stringify(Array.from(user ? user : [])), (err) => {
      if(err) {
        console.error(err)
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

async function loadHendz() {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(assetsPath, 'data/hendz.json'), (err, data) => {
      if(err) {
        console.error(err)
        resolve(new Set())
      } else {
        resolve(new Set(JSON.parse(data)))
      }
    })
  })
}
