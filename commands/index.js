const { logInteraction } = require('../utils/index.js')

const { hello } = require('./hello.js')
const { getUptime } = require('./uptime.js')
const { AttachmentBuilder, MessageFlags } = require('discord.js')
const { getEvents } = require('./xoncflix.js')
const { hendzHandler } = require('./hendz.js')
const { timevidsHandler } = require('./timevids.js')
const { characterCustomizerHandler } = require('./character-customizer.js')

module.exports.interactions = async function (interaction) {
  if (!interaction.isChatInputCommand()) return
  let file

  logInteraction(interaction)

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
      interaction.reply(`I've been up for ${getUptime()}`, { flags: MessageFlags.Ephemeral })
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
    case 'hendz':
      hendzHandler(interaction)
        .then((response) => {
          interaction.reply(response)
        })
      break
    case 'timevids':
      timevidsHandler(interaction)
        .then((response) => {
          interaction.reply(response)
        })
      break
    case 'character':
      characterCustomizerHandler(interaction)
        .then((response) => {
          interaction.reply(response)
        })
      break
    default:
      interaction.reply('Unknown command', { flags: MessageFlags.Ephemeral })
      break
  }
}
