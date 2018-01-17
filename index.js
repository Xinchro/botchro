const Discordie = require("discordie")
const client = new Discordie()
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

client.connect({ token: process.env.TOKEN })

client.Dispatcher.on("GATEWAY_READY", e => {
  console.log("Connected as: " + client.User.username)
})

client.Dispatcher.on("MESSAGE_CREATE", e => {
  dealWithMessage(e.message)
  
})

function dealWithMessage(message) {
  if(message.channel.isPrivate) {
    if(message.author.username.toLowerCase() != botname.toLowerCase()) {
      dealWithDMMessage(message).then((data) => {
        message.channel.sendMessage(data.msg, data.tts, data.embed)
      }, (data) => { if(data != null) message.channel.sendMessage(data.msg, data.tts, data.embed) })
    }
  } else {
    dealWithServerMessage(message).then((data) => {
      message.channel.sendMessage(data.msg, data.tts, data.embed)
    }, (data) => { if(data != null) message.channel.sendMessage(data.msg, data.tts, data.embed) })
  }
}

function dealWithDMMessage(message) {
  return new Promise((resolve, reject) => {
    if(message.content === "oh") {
      resolve({ msg:"oh ok" })
      reject(null)
    } else 
    if(message.content === "ok") {
      resolve({ msg:"ok" })
      reject(null)
    } else
    if(message.content === "oh ok") {
      resolve({ msg:"oh" })
      reject(null)
    } else {
      message.channel.uploadFile(fs.readFileSync("assets/img/shoo.gif"), "assets/img/shoo.gif")
      .then(resolve({ msg: "Don't DM me. Go away." }))
    }
  })
}

function dealWithServerMessage(message) {
  let msg = message.content

  if(msg[0] === "!") {
    return checkCommand(msg.split("!")[1])
  } else
  if(msg.split(" ")[0] === botclient) {
    return replyToPing(message)
  } else {
    return new Promise((resolve, reject) => {
      switch(msg) {
        default:
          reject(null)
      }
    })
  }
}

function replyToPing(message) {
  let msgAfterAt = message.content.split(`${botclient} `).pop(1).toLowerCase()
  return new Promise((resolve, reject) => {
    try {
      if(msgAfterAt.match(/(?:\<\@\!.*\>)/gi)) {
        resolve({msg: `Hello ${message.author.username}, what about ${msgAfterAt.match(/(?:\<\@\!.*\>)/g)[0]}?`})
      } else
      if(msgAfterAt.match(/^(?:\w)+ me/gi)) {
        resolve({msg: "no"})
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

          resolve({ msg: negative[Math.floor((Math.random()*negative.length))] })
        } else {
          resolve({ msg: `Hello <@!${message.author.id}>!` })
        }
      } else
      if(msgAfterAt === "i love you"
        || msgAfterAt === "ily") {
        resolve({msg: ":congratulations:"})
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

function textToArray(file, del) {
  // reads file, splits at line break, returns array
  return fs.readFileSync(file, "utf-8").split(del)
}

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
      return new Promise((res, rej) => { res({ msg: getUptime()}); rej(null) })
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

function getOverwatchStats(user, plat, reg) {
  let url = `http://ow-api.herokuapp.com/profile/${plat}/${reg}/${user}`
  return new Promise((resolve, reject) => {
    fetch(url)
    .then((data) => {
      if(data.status === 200) {
        resolve(data.json())
      } else {
        reject({ msg: "Failed to retrieve Overwatch data." })
      }
    },
    (data) => { reject({ msg: "Failed to retrieve Overwatch data." }) }
    )
  })
}


function formatOverwatchStats(data) {
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