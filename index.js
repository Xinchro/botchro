const Discordie = require("discordie")
const client = new Discordie()
const http = require("http")
const https = require("https")
const fetch = require("node-fetch")
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

client.connect({ token: process.env.TOKEN })

client.Dispatcher.on("GATEWAY_READY", e => {
  console.log("Connected as: " + client.User.username)
})

client.Dispatcher.on("MESSAGE_CREATE", e => {
  checkMessage(e.message).then((data) => {
    e.message.channel.sendMessage(data.msg, data.tts, data.embed)
  }, (data) => { if(data != null) e.message.channel.sendMessage(data.msg, data.tts, data.embed) })
})

function checkMessage(message) {
  let msg = message.content

  if(msg[0] === "!") {
    return checkCommand(msg.split("!")[1])
  } else
  if(msg.split(" ")[0] === botclient) {
    return replyToPing(message)
  } else {
    return new Promise((resolve, reject) => {
      switch(msg) {
        case "doot":
          resolve({ msg: "doot!" })
          break
        case "boop":
          resolve({ msg:"", embed: {
            color: 3447003,
            description: "A very simple Embed!"
          }})
        default:
          reject(null)
      }
    })
  }
}

function replyToPing(message) {
  let msgAfterAt = message.content.split(`${botclient} `).pop(1)
  return new Promise((resolve, reject) => {
    try {
      if(msgAfterAt.match(/(?:\<\@\!.*\>)/g)) {
        resolve({msg: `Hello ${message.author.username}, what about ${msgAfterAt.match(/(?:\<\@\!.*\>)/g)[0]}?`})
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
        resolve({msg: `Hello <@!${message.author.id}>!`})
      } else {
        resolve({msg: `Hello!`})
      }
    } catch(err) {
      console.error(err)
      reject(null)
    }
  })
}

function checkCommand(command) {
  switch(command.split(" ")[0]) {
    case "hello":
      return hello()
      break
    case "status":
      return status()
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

function status() {
  return new Promise((resolve, reject) => {
    try {
      resolve({ 
        msg: "", tts: false, embed: {
          color: 0x00FF00,
          title: "Running smoothly!",
          fields: [
            { name: "Stats", value: `Uptime: ${getUptime()}`, inline: false }
          ]
        }
      })
    } catch(err) {
      console.error(err)
      reject({ 
        msg: "", tts: false, embed: {
          color: 0xFF0000,
          title: "This is fine. :fire:"
        }
      })
    }
  })
}

function hello() {
  return new Promise((resolve, reject) => {
    try {
      resolve({
        msg: "", tts: false, embed: {
          color: 0x00FF00,
          author: { name: botname },
          url: "https://xinchronize.com",
          fields: [
            { name: "Hello!", value: `I am ${botname}! Beep boop!`, inline: false },
            { name: "Creator", value: "I was created by Saltchr-, I mean Xinchro!", inline: true },
            { name: "Stats", value: "I was last updated at some point\nI have been awake for some time", inline: true }
          ],
          footer: { text: "Powered by salt.", icon_url: "https://xinchronize.com/assets/logo.png" }
        } 
      })
    } catch(err) {
      console.error(err)
      reject(null)
    }
  })
}

function getOverwatchStats(plat, reg, user) {
  let url = `http://ow-api.herokuapp.com/profile/${plat}/${reg}/${user}`
  return new Promise((resolve, reject) => {
    fetch(url)
    .then((data) => { resolve(data.text()) }, (data) => { reject(data.text) })
  })
}

function formatOverwatchStats(data) {
  data = JSON.parse(data)
  return new Promise((resolve, reject) => {
    try {
      resolve({
        msg: "", tts: false, embed: {
          color: 0x3498db,
          author: { name: data.username, icon_url: data.portrait },
          title: data.username,
          url: "https://playoverwatch.com/en-us/career/pc/eu/Xinchro-2390",
          thumbnail: { url: data.competitive.rank_img },
          fields: [
            { name: "Current season SR", value: data.competitive.rank, inline:false },
            { name: "Competitive", 
              value: `${data.playtime.competitive}\nWon: ${data.games.competitive.won}\nLost: ${data.games.competitive.lost}`, inline:true },
            { name: "Quicklplay", 
              value: `${data.playtime.quickplay}\nWon: ${data.games.quickplay.won}`, inline:true },
          ],
          footer: { text: "Data provided by https://github.com/alfg/overwatch-api" }
        } 
      })
    } catch(err) {
      console.error(err)
      reject(null)
    }
  })
}