const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')
const { MongoClient } = require('mongodb')
const mongoUri = `mongodb://${process.env.MONGOUSER}:${process.env.MONGOPASSWORD}@${process.env.MONGOHOST}:${process.env.MONGOPORT}`
const mongoClient = new MongoClient(mongoUri)
const assetsPath = path.join(__dirname, '..', 'assets')

module.exports.formatDateTime  = (time) => {
  const date = new Date(time)
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()

  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`
}

module.exports.getLastCommitTime = () =>  {
  const curl = execSync('curl https://api.github.com/repos/xinchro/botchro/commits?per_page=1')
  const commitTime = this.formatDateTime(JSON.parse(curl)[0].commit.author.date)

  return commitTime
}

module.exports.getLastCommitMessage = () => {
  const curl = execSync('curl https://api.github.com/repos/xinchro/botchro/commits?per_page=1')
  const commitMessage = JSON.parse(curl)[0].commit.message.split('\n')[0]

  return commitMessage
}

module.exports.timeDifference = (current, target) => {
  const difference = new Date(target).getTime() - new Date(current).getTime()
  const days = Math.floor(difference / (1000 * 60 * 60 * 24))
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
  let differenceString = ''

  if(days) differenceString += `${days}d `
  if(hours) differenceString += `${hours}h `
  if(minutes) differenceString += `${minutes}m `

  if(difference < 0) {
    return '5M:0L:-D:3L:4Y'
  }

  if(differenceString) {
    return `in ${differenceString}`
  } else {
    return 'less than a minute'
  }
}

module.exports.logInteraction = (interaction) => {
  let logline = `Interaction from ${interaction.user.username}#${interaction.user.discriminator} (${interaction.user.id}) - ${interaction.commandName}`
  if(interaction.options) {
    if(interaction.options._subcommand) {
      logline += ` ${interaction.options._subcommand}`
      if(interaction.options._hoistedOptions) {
        interaction.options._hoistedOptions.forEach((option) => {
          logline += ` ${option.name}: ${option.value}`
        })
      }
    }
  }

  console.log(logline)
}

module.exports.saveTimevids = (vids) => {
  return new Promise(async (resolve, reject) => {
    await mongoClient.connect()
    const db = mongoClient.db('botchro')
    const collection = db.collection('timevids')

    try {
      await collection.deleteMany({})
      if(vids.size) await collection.insertMany(Array.from(vids).map((url) => ({ url })))
      resolve()
    } catch (err) {
      console.error(err)
      reject()
    }
  })
}

module.exports.loadTimevids = async () => {
  return new Promise(async (resolve, reject) => {
    await mongoClient.connect()
    const db = mongoClient.db('botchro')
    const collection = db.collection('timevids')

    try {
      const result = (await collection.find().toArray()).map((r) => r.url)
      resolve(new Set(result))
    } catch (err) {
      console.error(err)
      reject(new Set())
    }
  })
}

module.exports.getUserCharacterConfig = async (userId) => {
  return new Promise(async (resolve, reject) => {
    await mongoClient.connect()
    const db = mongoClient.db('botchro')
    const collection = db.collection('userconfig')

    try {
      const result = await collection.findOne({ id: userId })
      resolve(result.character)
    } catch (err) {
      console.error(err)
      reject()
    }
  })
}
