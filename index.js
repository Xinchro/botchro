require("dotenv").config()
const { REST, Routes, AttachmentBuilder  } = require('discord.js')

const token = process.env.TOKEN
const botid = process.env.BOTID
const botname = process.env.BOTNAME

const commands = [
  {
    name: 'ping',
    description: 'Replies with Pong!'
  },
  {
    name: 'yay',
    description: 'YyyaaAaAAaaYYyy'
  },
  {
    name: 'aah',
    description: 'AAAAAaaaaAAAAhhhh...'
  },
  {
    name: 'uptime',
    description: 'Shows the uptime of the bot'
  }
]

const rest = new REST({ version: '10' }).setToken(token)

async function loadCommands() {
  try {
    console.log('Started refreshing application (/) commands.')

    await rest.put(Routes.applicationCommands(botid), { body: commands })

    console.log('Successfully reloaded application (/) commands.')
  } catch (error) {
    console.error(error)
  }
}

loadCommands()

const { Client, GatewayIntentBits } = require('discord.js')
const client = new Client({ intents: [GatewayIntentBits.Guilds] })

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on('interactionCreate', async interaction => {
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
    default:
      interaction.reply('Unknown command', { ephemeral: true })
      break
  }
})

function getUptime() {
  const uptime = process.uptime()
  const days = Math.floor(uptime / 86400)
  const hours = Math.floor(uptime / 3600) % 24
  const minutes = Math.floor(uptime / 60) % 60
  const seconds = Math.floor(uptime % 60)
  return `${days}d ${hours}h ${minutes}m ${seconds}s`
}

client.login(token)
