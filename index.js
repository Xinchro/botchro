const Discord = require("discord.js")
const client = new Discord.Client()
const http = require("http")
const https = require("https")
const fetch = require("node-fetch")
const fs = require("fs")
require("dotenv").config()

const botclient = process.env.BOTCLIENT
const botname = process.env.BOTNAME

let uptime = 0
let uptimeClock = setInterval(() => {
  uptime += 1
}, 1000)

function getUptime() {
  let tempup = uptime
  let days = Math.floor(tempup/(60*60*24))
  tempup -= days*24*60*60
  let hours = Math.floor(tempup/(60*60))
  tempup -= hours*60*60
  let minutes = Math.floor(tempup/60)
  tempup -= minutes*60
  let seconds = tempup

  return `${days}d${hours}h${minutes}m${seconds}s`
}

// when ready, print bot name
client.on("ready", () => {
  console.log(`Connected as: ${client.user.username}#${client.user.discriminator}`)
  client.user.setActivity("How To Be Human 101", { type: "LISTENING" })
})

client.on("message", msg => {
  dealWithMessage(msg)
})

// connects the bot associated with the token
client.login(process.env.TOKEN)

// check if message is private(DM) or public(server/guild)
function dealWithMessage(message) {
  if(message.channel.type==="dm") {
    dealWithDMMessage(message)
      .then((data) => {
        send(message, { content: data.content, options: data.options })
      })
      .catch((data) => {
        // fail silently
        logError(data)
      })
  } else {
    dealWithServerMessage(message)
      .then((data) => {
        send(message, { content: data.content, options: data.options })
      })
      .catch((data) => {
        // fail silently
        logError(data)
      })
  }
}

function send(srcMessage, message) {
  if(srcMessage.author.id === process.env.BOTID) return
  if(!message.content) return

  srcMessage.channel.send(message.content, message.options)
    .then()
    .catch(console.error)
}

function logError(error) {
  if(error === null) return // ignore null errors(nothing to do)
  console.error(error)
}

// deals with messages sent in a DM
function dealWithDMMessage(message) {
  return new Promise((resolve, reject) => {
    if(message.content === "oh") {
      resolve({ content:"oh ok" })
      reject(null)
    } else
    if(message.content === "ok") {
      resolve({ content:"ok" })
      reject(null)
    } else
    if(message.content === "oh ok") {
      resolve({ content:"oh" })
      reject(null)
    } else {
      resolve({
        content: "Don\"t DM me. Go away.",
        options: {
          files: [{
            attachment: "assets/img/shoo.gif",
            name: "shoo.gif"
          }]
        }
      })
    }
  })
}

// deals with message sent in a channel on a server
function dealWithServerMessage(message) {
  let msg = message.content

  // checks if the message is a command("!")
  if(msg[0] === "!") {
    return checkCommand(msg.split("!")[1], message.channel)
  } else
  // checks if the message is @ the bot
  if(msg.split(" ")[0] === botclient) {
    return replyToPing(message)
  } else {
    return new Promise((resolve, reject) => {
      reject(null)
    })
  }
}

// replies to @ messages to the bot
function replyToPing(message) {
  let msgAfterAt = message.content.split(`${botclient} `).pop(1).toLowerCase()
  return new Promise((resolve, reject) => {
    try {
      if(msgAfterAt.match(/(?:\<\@\!.*\>)/gi)) {
        resolve({content: `Hello ${message.author.username}, what about ${msgAfterAt.match(/(?:\<\@\!.*\>)/g)[0]}?`})
      } else
      if(msgAfterAt.match(/^(?:\w)+ me/gi)) {
        resolve({content: "no"})
      } else
      if(msgAfterAt === "hello"
        || msgAfterAt === "hello "
        || msgAfterAt === "helo"
        || msgAfterAt === "helo "
        || msgAfterAt === "hallo"
        || msgAfterAt === "hallo "
        || msgAfterAt === "halo"
        || msgAfterAt === "halo "
        ) {
        if(Math.floor((Math.random()*100)+1) < 90) {
          let negative = textToArray("assets/text/negative_replies.txt", "\n")

          resolve({ content: negative[Math.floor((Math.random()*negative.length))] })
        } else {
          resolve({ content: `Hello <@!${message.author.id}>!` })
        }
      } else
      if(msgAfterAt === "i love you"
        || msgAfterAt === "ily") {
        resolve({content: ":congratulations:"})
      } else
      if(msgAfterAt === "git gud"
        || msgAfterAt === "gitgud") {
        message.channel.uploadFile(fs.readFileSync("assets/img/gitgud.jpg"))
        resolve()
      } else {
        reject(null)
      }
    } catch(err) {
      console.error(err)
      reject(null)
    }
  })
}

// changes a text file to an array based on the given delimiter
function textToArray(file, del) {
  // reads file, splits at line break, returns array
  return fs.readFileSync(file, "utf-8").split(del)
}


// checks and deals with commands
function checkCommand(command) {
  switch(command.split(" ")[0]) {
    case "hello":
      return hello()
      break
    case "status":
      return status()
      break
    case "delete":
      break
    case "uptime":
      return new Promise((res, rej) => {
        res({ content: getUptime()})
        rej("Failed to show uptime")
      })
      break
    case "yay":
      return new Promise((res, rej) => {
          res({
            content: {
              files: [{
                attachment: "assets/audio/yinbyay.flac",
                name: "yay.flac"
              }]
            }
          })
        })
      break
    case "AAAAAaaaaAAAAhhhh":
      return new Promise((res, rej) => {
        res({
          content: "AAaaaaahhh...",
          options: {
            files:[{
              attachment: "assets/audio/yinbaah.flac",
              name: "aah.flac"
            }]
          }
        })
      })
      break
    case "overwatch":
      return getOverwatchStats(command.split(" ")[1], command.split(" ")[2], command.split(" ")[3])
        .then((data) => { return formatOverwatchStats(data) })
        .then((data) => { return data })
      break
    default:
      return new Promise((resolve, reject) => reject(null))
  }
}

// returns the bot status as an embed, green for good, red for bad
function status() {
  return new Promise((resolve, reject) => {
    try {
      resolve({
        content: {
          embed: {
            color: 0x00FF00,
            title: "Running smoothly!",
            fields: [
              { name: "Stats", value: `Uptime: ${getUptime()}`, inline: false }
            ]
          }
        }
      })
    } catch(err) {
      reject({
        content: {
          embed: {
            color: 0xFF0000,
            title: "This is fine. :fire:"
          }
        }
      })
    }
  })
}


// greets users that say hello
function hello() {
  return new Promise((resolve, reject) => {
    try {
      resolve({
        content: {
          embed: {
            color: 0x00FF00,
            author: { name: botname },
            url: "https://xinchronize.com",
            fields: [
              { name: "Hello!", value: `I am ${botname}! Beep boop!`, inline: false },
              { name: "Creator", value: "I was created by a͜҉n̕ ̶͜id̵̶i̴o̶t̴̢ ..... I mean Xinchro!", inline: true },
              { name: "Stats", value: "I was last updated at̷ ̶͏́s̡̕͝o̡m̷̀́e̶͟ ̢po̸i̡̛n̛͡t͏\nI have been awake for l̷͟o̧͟͜n͝g͜͠ e̷no̢͜u̶g̷̡͡h", inline: true }
            ],
            footer: { text: "Powered by salt.", icon_url: "https://xinchronize.com/assets/logo.png" }
          }
        }
      })
    } catch(err) {
      reject(null)
    }
  })
}

// get the overwatch data from the data service
function getOverwatchStats(user, plat, reg) {
  let url = `http://ow-api.herokuapp.com/profile/${plat}/${reg}/${user}`
  return new Promise((resolve, reject) => {
    fetch(url)
    .then((data) => {
      if(data.status === 200) {
        resolve(data.json())
      } else {
        reject({ content: "Failed to retrieve Overwatch data." })
      }
    },
    (data) => { reject({ content: "Failed to retrieve Overwatch data." }) }
    )
  })
}

// formats the overwatch data and resolves with an embed
function formatOverwatchStats(data) {
  return new Promise((resolve, reject) => {
    try {
      resolve({
        content: {
          embed: {
            color: 0x3498db,
            author: { name: data.username, icon_url: data.portrait },
            title: data.username,
            url: `https://playoverwatch.com/en-us/career/pc/eu/${data.username}`,
            thumbnail: { url: data.competitive.rank_img || "" },
            fields: [
              { name: "Current season SR", value: data.competitive.rank || 0, inline:false },
              { name: "Competitive",
                value: `${data.playtime.competitive || 0}\nWon: ${data.games.competitive.won || 0}\nLost: ${data.games.competitive.lost || 0}`, inline:true },
              { name: "Quickplay",
                value: `${data.playtime.quickplay || 0}\nWon: ${data.games.quickplay.won || 0}`, inline:true },
            ],
            footer: { text: "Data provided by https://github.com/alfg/overwatch-api" }
          }
        }
      })
    } catch(err) {
      reject(null)
    }
  })
}


exports.getUptime = getUptime
exports.dealWithMessage = dealWithMessage
exports.send = send
exports.logError = logError
exports.dealWithDMMessage = dealWithDMMessage
exports.dealWithServerMessage = dealWithServerMessage
exports.replyToPing = replyToPing
exports.textToArray = textToArray
exports.checkCommand = checkCommand
exports.status = status
exports.hello = hello
exports.getOverwatchStats = getOverwatchStats
exports.formatOverwatchStats = formatOverwatchStats
