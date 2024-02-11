const { MongoClient } = require('mongodb')
const mongoUri = `mongodb://${process.env.MONGOUSER}:${process.env.MONGOPASSWORD}@${process.env.MONGOHOST}:${process.env.MONGOPORT}`
const mongoClient = new MongoClient(mongoUri)
const db = mongoClient.db('botchro')
const collection = db.collection('userconfig')

module.exports.xonccharHandler = async (interaction) => {
  switch (interaction.options.getSubcommand()) {
    case 'set':
      return { content: await this.setUserCharacter(interaction), ephemeral: true }
    case 'get':
      return { content: await this.getUserCharacter(interaction), ephemeral: true }
    default:
      return 'wat'
  }
}

module.exports.setUserCharacter = async (interaction) => {
  return new Promise(async (resolve, reject) => {
    // get user id from interaction
    const userId = interaction.user.id
    // get character config code from interaction
    const charCode = interaction.options.getString('code')

    const codeRegex = new RegExp('^s[0-9]c[0-9]$')

    // set character config code against user id in db
    try {
      if(codeRegex.test(charCode)) {
        await collection.updateOne({ id: userId }, { $set: { character: charCode } }, { upsert: true })
        resolve('Your character has been set!')
      } else {
        reject('Invalid character code')
      }
    } catch (err) {
      console.error(err)
      reject(err)
    }
  })
}

module.exports.getUserCharacter = async (interaction) => {
  return new Promise(async (resolve, reject) => {
    try {
      const character = await collection.findOne({ id: interaction.user.id })
      resolve(`Your character is ${character.character}`)
    } catch (err) {
      console.error(err)
      reject(err)
    }
  })
}