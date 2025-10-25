require("dotenv").config()
const { REST, Routes } = require('discord.js')
const { loadTimevids, loadCharacterConfig } = require('./utils/index.js')
const { commands } = require('./commands/commands.js')

const token = process.env.TOKEN
const botid = process.env.BOTID

const rest = new REST({ version: '10' }).setToken(token)
const { ActivityType } = require('discord.js')

async function loadCommands() {
  try {
    console.log('Started refreshing application (/) commands.')

    const data = await rest.put(Routes.applicationCommands(botid), { body: commands })

    console.log(`Successfully reloaded ${data.length} application (/) commands.`)
  } catch (error) {
    console.error(error)
  }
}

loadCommands()

const { client } = require('./client.js')
const { interactions } = require('./commands/index.js')

client.on('clientReady', () => {
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

http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url)
  let pathname = path.join(__dirname+'/assets', parsedUrl.pathname)
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Request-Method': '*',
    'Access-Control-Allow-Methods': 'OPTIONS, GET',
    'Access-Control-Allow-Headers': '*'
  }

  if(req.method === 'OPTIONS') {
    res.writeHead(204, headers)
    res.end()
    return
  }

  if(req.method === 'GET') {
    if(parsedUrl.pathname === '/data/timevids') {
      loadTimevids().then((data) => {
        res.writeHead(200, headers)
        res.end(JSON.stringify(Array.from(data)))
      })
      return
    }

    if(parsedUrl.pathname === '/character') {
      const characterId = new URL(`http://${process.env.HOST ?? 'localhost'}${req.url}`).searchParams.get('id')
      loadCharacterConfig(characterId)
        .then((data) => {
          res.writeHead(200, headers)
          res.end(data)
        })
        .catch(e => {
          res.writeHead(200, headers)
          res.end('01|00|00|00|00')
        })
      return
    }

    res.writeHead(200, headers)
    fs.readFile(pathname, function(err, data) {
      if(err) {
        res.statusCode = 404
        res.end()
      } else {
        res.statusCode = 200
        res.end(data)
      }
    })

    return
  }
}).listen(PORT)

console.log(`assets served on port ${PORT}`)
