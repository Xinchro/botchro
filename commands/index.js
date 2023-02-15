const { hello } = require('./hello.js')
const { getUptime } = require('./uptime.js')
const { AttachmentBuilder } = require('discord.js')
const { getEvents } = require('./xoncflix.js')

module.exports.interactions = async function (interaction) {
  if (!interaction.isChatInputCommand()) return
  let file

  switch (interaction.commandName) {
    case 'ping':
      await interaction.reply('Pong!')
      break
    case 'yay':
      file = new AttachmentBuilder('./assets/audio/yinbyay.flac').setName('yay.flac')
      interaction.reply({ files: [file] })
      break
    case 'aah':
      file = new AttachmentBuilder('./assets/audio/yinbaah.flac').setName('AAAAAaaaaAAAAhhhh.flac')
      interaction.reply({ files: [file] })
      break
    case 'uptime':
      interaction.reply(`I've been up for ${getUptime()}`)
      break
    case 'hello':
      interaction.reply({ embeds: [hello()] })
      break
    case 'xoncflix':
      getEvents(interaction.guild)
      .then((events) => {
        interaction.reply({ embeds: [events] })
      })
      .catch((err) => { console.log(err) })
      break
    default:
      interaction.reply('Unknown command', { ephemeral: true })
      break
  }
}


module.exports.hello
module.exports.uptime
