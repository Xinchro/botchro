let hendz = new Set()

module.exports.hendzHandler = async (interaction) => {
  if(!interaction.options.getString('what')) return "nope"
  switch(interaction.options.getString('what')) {
    case 'show':
      return { content: this.showHend(interaction), ephemeral: true }
    case 'hide':
      return { content: this.hideHend(interaction), ephemeral: true }
    case 'peek':
      return { content: this.getHendz(interaction), ephemeral: false }
    case 'reset':
      return { content: this.resetHendz(interaction), ephemeral: true }
    default:
      return 'wat'
  }
}

module.exports.showHend = (interaction) => {
  hendz.add(interaction.user.username)
  return 'You\'ve hendz\'d'
}

module.exports.hideHend = (interaction) => {
  hendz.delete(interaction.user.username)
  return 'You\'ve unhendz\'d'
}

module.exports.getHendz = () => {
  let hendzArray = Array.from(hendz)
  return `People who have hendz'd: ${hendzArray.length > 0 ? hendzArray.join(', ') : 'No-one. Very sad. :('}`
}

module.exports.resetHendz = () => {
  hendz.clear()
  return 'Hendz have been reset'
}
