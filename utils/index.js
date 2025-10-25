const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const { S3Client, ListObjectsCommand, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3')

const assetsPath = path.join(__dirname, '..', 'assets')

const data = {}

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
  const curl = execSync('curl -s https://api.github.com/repos/xinchro/botchro/commits?per_page=1').toString()
  const commitTime = this.formatDateTime(JSON.parse(curl)[0].commit.author.date)

  return commitTime
}

module.exports.getLastCommitMessage = () => {
  const curl = execSync('curl -s https://api.github.com/repos/xinchro/botchro/commits?per_page=1').toString()
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
    const s3Client = new S3Client({
      region: 'eu-west-2',
      credentials: {
        accessKeyId: process.env.AWSKEY,
        secretAccessKey: process.env.AWSSECRET
      }
    })

    data.vids = Array.from(vids)

    await s3Client.send(
      new PutObjectCommand({
        Body: JSON.stringify(data.vids),
        Bucket: 'botchro-data',
        Key: `data-vids-${process.env.ENVIRONMENT}.json`,
        ContentType: 'application/json'
      })
    ).finally(() => {
      resolve()
    }).catch(() => {
      reject("Saving vids failed")
    })
  })
}

module.exports.loadTimevids = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const s3Client = new S3Client({
        region: 'eu-west-2',
        credentials: {
          accessKeyId: process.env.AWSKEY,
          secretAccessKey: process.env.AWSSECRET
        }
      })

      const resp = await s3Client.send(
        new GetObjectCommand({
          Bucket: 'botchro-data',
          Key: `data-vids-${process.env.ENVIRONMENT}.json`
        })
      )

      const vids = (await resp.Body.transformToString())

      resolve(new Set(JSON.parse(vids)))
    } catch(e) {
      console.error(e)
      reject("Failed to load time vids")
    }
  })
}

module.exports.saveCharacter = async (user, character, remove = false) => {
  const characters = await loadCharacters().catch(() => {
    return "Saving character failed, try again later?"
  })

  return new Promise(async (resolve, reject) => {
    const s3Client = new S3Client({
      region: 'eu-west-2',
      credentials: {
        accessKeyId: process.env.AWSKEY,
        secretAccessKey: process.env.AWSSECRET
      }
    })

    data.characters = characters
    data.characters[user] = character
    if(remove) delete data.characters[user]

    await s3Client.send(
      new PutObjectCommand({
        Body: JSON.stringify(data.characters),
        Bucket: 'botchro-data',
        Key: `data-users-${process.env.ENVIRONMENT}.json`,
        ContentType: 'application/json'
      })
    ).catch((e) => {
      console.error(e)
      reject("Saving character failed, try again later?")
    }).finally(() => {
      resolve(`Character updated to ${character}!`)
    })
  })

}

async function loadCharacters() {
  return new Promise(async (resolve, reject) => {
    try {
      const s3Client = new S3Client({
        region: 'eu-west-2',
        credentials: {
          accessKeyId: process.env.AWSKEY,
          secretAccessKey: process.env.AWSSECRET
        }
      })

      const resp = await s3Client.send(
        new GetObjectCommand({
          Bucket: 'botchro-data',
          Key: `data-users-${process.env.ENVIRONMENT}.json`
        })
      )

      const characters = JSON.parse(await resp.Body.transformToString())

      resolve(characters)
    } catch(e) {
      console.error(e)
      reject("Failed to load characters, sorry.")
    }
  })
}

module.exports.loadCharacter = async (user) => {
  return new Promise(async (res, rej) => {
    await this.loadCharacterConfig(user)
      .then((config) => {
        res(`Your character is currently set to: ${config}\nYou can see it here: https://botchro.xinchronize.com?character=${config}`)
      })
      .catch(e => {
        if(e === 1) {
          res("No character set for you. (yet?)")
        } else {
          res("Failed to character, sorry.")
        }
      })
  })
}

module.exports.loadCharacterConfig = async (user) => {
  return new Promise(async (resolve, reject) => {
    try {
      const s3Client = new S3Client({
        region: 'eu-west-2',
        credentials: {
          accessKeyId: process.env.AWSKEY,
          secretAccessKey: process.env.AWSSECRET
        }
      })

      const resp = await s3Client.send(
        new GetObjectCommand({
          Bucket: 'botchro-data',
          Key: `data-users-${process.env.ENVIRONMENT}.json`
        })
      )

      const characters = JSON.parse((await resp.Body.transformToString()))
      if(Object.keys(characters).includes(user)) {
        const character = characters[user]

        resolve(character)
      } else {
        reject(1)
      }
    } catch(e) {
      console.error(e)
      reject(1)
    }
  })
}
