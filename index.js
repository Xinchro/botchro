require("dotenv").config()
const { REST, Routes } = require('discord.js')

const token = process.env.TOKEN
const botid = process.env.BOTID

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
const { interactions } = require('./commands/index.js')
const client = new Client({ intents: [GatewayIntentBits.Guilds] })

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on('interactionCreate', interactions)

client.login(token)
