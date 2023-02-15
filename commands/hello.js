require("dotenv").config()
const botname = process.env.BOTNAME
const { getLastCommitTime, getLastCommitMessage } = require('../utils/index.js')
const { getUptime } = require('./uptime.js')

module.exports.hello = function () {
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
