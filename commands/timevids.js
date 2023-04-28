const { loadTimevids, saveTimevids } = require('../utils/index.js')

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

  if(!url.match(/(youtube.com|youtu.be|reddit.com|v.redd.it|i.imgur.com|twitter.com|instagram.com)/)) {
    return `Timevid video must be a supported site.
    Supported sites:
    - YouTube
    - Reddit
    - Imgur
    - Twitter
    - Instagram`
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
