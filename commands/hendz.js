const { MessageFlags } = require('discord.js')
const fs = require('fs')
const path = require('path')
const assetsPath = path.join(__dirname, '..', 'assets')

module.exports.hendzHandler = async (interaction) => {
  switch(interaction.options.getSubcommand()) {
    case 'show':
      return { content: await this.showHend(interaction), flags: MessageFlags.Ephemeral }
    case 'hide':
      return { content: await this.hideHend(interaction), flags: MessageFlags.Ephemeral }
    case 'peek':
      return { content: await this.getHendz(interaction) }
    case 'reset':
      return { content: await this.resetHendz(interaction), flags: MessageFlags.Ephemeral }
    default:
      return 'wat'
  }
}

module.exports.showHend = async (interaction) => {
  const hendz = await loadHendz()
  hendz.add({name: interaction.user.username, id: interaction.user.id})
  await saveHendz(hendz)
  return 'You\'ve hendz\'d'
}

module.exports.hideHend = async (interaction) => {
  const hendz = await loadHendz()
  hendz.delete(interaction.user.username)
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
