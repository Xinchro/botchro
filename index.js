require("dotenv").config()
const { REST, Routes } = require('discord.js')

const token = process.env.TOKEN
const botid = process.env.BOTID

const commands = [
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
  },
  {
    name: 'xoncflix',
    description: 'Next Xoncflix'
  },
  {
    name: 'hendz',
    description: 'Hendz actions',
    options: [
      {
        name: 'what',
        description: 'Choose how to hend',
        type: 3,
        required: true,
        choices: [
          {
            name: 'Show hend 🖐',
            value: 'show'
          },
          {
            name: 'Hide hend 🚫🖐',
            value: 'hide'
          },
          {
            name: 'Peek hendz 👀🖐',
            value: 'peek'
          },
          {
            name: 'Reset hendz 🔪🖐',
            value: 'reset'
          }
        ]
      }
    ]
  }
]

const rest = new REST({ version: '10' }).setToken(token)
const { ActivityType } = require('discord.js')

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

const { client } = require('./client.js')
const { interactions } = require('./commands/index.js')

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
  client.user.setActivity('How To Be Human 101', { type: ActivityType.Watching  })
})

client.on('interactionCreate', interactions)

client.login(token)

/* light server to serve the assets folder */
const http = require('http')
const url = require('url')
const fs = require('fs')
const path = require('path')

const PORT = process.env.PORT || 3000

http.createServer( (req, res) => {
  const parsedUrl = url.parse(req.url)
  let pathname = path.join(__dirname+'/assets', parsedUrl.pathname)

  fs.readFile(pathname, function(err, data) {
    if(err) {
      res.statusCode = 404
      res.end()
    } else {
      res.end(data)
    }
  })
}).listen(PORT)

console.log(`assets served on port ${PORT}`)
