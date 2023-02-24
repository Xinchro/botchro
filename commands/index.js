const { hello } = require('./hello.js')
const { getUptime } = require('./uptime.js')
const { AttachmentBuilder } = require('discord.js')
const { getEvents } = require('./xoncflix.js')
const { hendzHandler } = require('./hendz.js')
const { timevidsHandler } = require('./timevids.js')

module.exports.interactions = async function (interaction) {
  if (!interaction.isChatInputCommand()) return
  let file

  switch (interaction.commandName) {
    case 'yay':
      file = new AttachmentBuilder('./assets/audio/yinbyay.flac').setName('yay.flac')
      interaction.reply({ files: [file] })
      break
    case 'aah':
      file = new AttachmentBuilder('./assets/audio/yinbaah.flac').setName('AAAAAaaaaAAAAhhhh.flac')
      interaction.reply({ files: [file] })
      break
    case 'uptime':
      interaction.reply(`I've been up for ${getUptime()}`, { ephemeral: true })
      break
    case 'hello':
      interaction.reply({ embeds: [hello()], ephemeral: false })
      break
    case 'xoncflix':
      getEvents(interaction.guild)
      .then((events) => {
        interaction.reply({ embeds: [events] })
      })
      .catch((err) => { console.log(err) })
      break
    case 'hendz':
      interaction.reply(hendzHandler(interaction))
      break
    case 'timevids':
      timevidsHandler(interaction)
        .then((response) => {
          interaction.reply(response)
        })
      break
    default:
      interaction.reply('Unknown command', { ephemeral: true })
      break
  }
}


module.exports.hello
module.exports.uptime
