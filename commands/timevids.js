const fs = require('fs')
const path = require('path')
const assetsPath = path.join(__dirname, '..', 'assets')

module.exports.timevidsHandler = async (interaction) => {
  switch (interaction.options.getSubcommand()) {
    case 'add':
      return { content: await this.addTimevid(interaction), ephemeral: true }
    case 'remove':
      return { content: await this.removeTimevid(interaction), ephemeral: true }
    case 'list':
      return { content: await this.getTimevids(interaction), ephemeral: true }
    case 'clear':
      return { content: await this.clearTimevids(interaction), ephemeral: true }
    default:
      return 'wat'
  }
}

module.exports.addTimevid = async (interaction) => {
  const timevids = await loadTimevids()
  const url = interaction.options.getString('url')
  
  if(timevids.has(url)) {
    return 'Timevid already exists'
  }

  if(!url.match(/(youtube.com|youtu.be|reddit.com|v.redd.it|i.imgur.com|twitter.com)/)) {
    return `Timevid video must be a supported site.
    Supported sites:
    - YouTube
    - Reddit
    - Imgur
    - Twitter`
  }

  timevids.add(interaction.options.getString('url'))
  await saveTimevids(timevids)
  return 'Timevid added'
}

module.exports.removeTimevid = async (interaction) => {
  const timevids = await loadTimevids()
  timevids.delete(interaction.options.getString('url'))
  await saveTimevids(timevids)
  return 'Timevid removed'
}

module.exports.getTimevids = async () => {
  const timevidsArray = Array.from(await loadTimevids())
  return `Timevids: ${timevidsArray.length > 0 ? timevidsArray.join(', ') : 'No timevids. Very sad. :('}`
}

module.exports.clearTimevids = async () => {
  await saveTimevids(new Set())
  return 'Timevids have been reset'
}

function saveTimevids(user) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path.join(assetsPath, 'data/timevids.json'), JSON.stringify(Array.from(user ? user : [])), (err) => {
      if (err) {
        console.error(err)
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

async function loadTimevids() {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(assetsPath, 'data/timevids.json'), (err, data) => {
      if (err) {
        console.error(err)
        resolve(new Set())
      } else {
        resolve(new Set(JSON.parse(data)))
      }
    })
  })
}
