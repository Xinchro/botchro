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
  },
  {
    name: 'hello',
    description: 'Bot information'
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
    case 'hello':
      interaction.reply({ embeds: [hello()] })
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

function getLastCommitTime() {
  const { execSync } = require('child_process')
  const commitTime = formatDateTime(execSync('git log master -1 --format=%cd').toString())
  return commitTime
}

function getLastCommitMessage() {
  const { execSync } = require('child_process')
  const commitMessage = execSync('git log master -1 --format=%s').toString().trimEnd()
  return commitMessage
}

function formatDateTime(time) {
  const date = new Date(time)
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()

  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`
}

function hello() {
  const embed = {
    color: 0x00FF00,
    author: { name: botname },
    title: "Hello!",
    fields: [
      { name: "Me", value: `I am ${botname}! Beep boop!`, inline: true },
      { name: "Creator", value: "I was created by a͜҉n̕ ̶͜id̵̶i̴o̶t̴̢  Xinchro!", inline: true
      },
      { name: "Stats", value: `I was last updated ${getLastCommitTime()} for "${getLastCommitMessage()}".\nI have been awake for ${getUptime()}`, inline: true }
    ],
    footer: { text: "Powered by salt.", icon_url: "https://xinchronize.com/assets/logo.png" }
  }
  return embed
}

client.login(token)
