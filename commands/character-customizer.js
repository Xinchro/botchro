const { MessageFlags } = require('discord.js')
const { logInteraction, saveCharacter, loadCharacter } = require('../utils')

// should match the limit of choices in the images
const limits = {
  body: 4,
  eyes: 6,
  hair: 182,
  outfit: 53,
  accessory: 20
}

module.exports.characterCustomizerHandler = async (interaction) => {
  switch (interaction.options.getSubcommand()) {
    case 'set':
      return { content: await this.updateCharacter(interaction), flags: MessageFlags.Ephemeral }
    case 'check':
      return { content: await this.checkCharacter(interaction), flags: MessageFlags.Ephemeral }
    case 'remove':
      return { content: await this.removeCharacter(interaction), flags: MessageFlags.Ephemeral }
    default:
      return 'wat'
  }
}

module.exports.updateCharacter = async (interaction) => {
  logInteraction(interaction)
  const code = interaction.options.getString('code')

  if(!/^(\d{0,3}\|){0,4}\d{0,3}$/.test(code)) {
    return "That code format looks incorrect. The correct format is 5 numbers separated by |.\ne.g. `01|02|03|04|05`"
  }
  const [ body, eyes, hair, outfit, accessory ] = code.split('|').map(Number)
  if(body < 1 || body > limits.body) {
    return "Your body choice looks incompatible. Please use the code from the customizer page, unchanged, and try again."
  }
  if(eyes < 0 || eyes > limits.eyes) {
    return "Your eyes choice looks incompatible. Please use the code from the customizer page, unchanged, and try again."
  }
  if(hair < 0 || hair > limits.hair) {
    return "Your hair choice looks incompatible. Please use the code from the customizer page, unchanged, and try again."
  }
  if(outfit < 0 || outfit > limits.outfit) {
    return "Your outfit choice looks incompatible. Please use the code from the customizer page, unchanged, and try again."
  }
  if(accessory < 0 || accessory > limits.accessory) {
    return "Your accessory choice looks incompatible. Please use the code from the customizer page, unchanged, and try again."
  }

  return await saveCharacter(interaction.user.id, code)
}

module.exports.checkCharacter = async (interaction) => {
  return await loadCharacter(interaction.user.id)
}

module.exports.removeCharacter = async (interaction) => {
  logInteraction(interaction)
  await saveCharacter(interaction.user.id, '', true)
  return "Customized Character removed."
}
