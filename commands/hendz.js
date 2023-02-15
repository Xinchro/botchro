let hendz = []

module.exports.hendzHandler = (interaction) => {
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
  hendz.push(interaction.user.username)
  return 'You\'ve hendz\'d'
}

module.exports.hideHend = (interaction) => {
  hendz = hendz.filter(hend => hend !== interaction.user.username)
  return 'You\'ve unhendz\'d'
}

module.exports.getHendz = (interaction) => {
  return `People who have hendz'd: ${hendz.join(', ').length > 0 ? hendz.join(', ') : 'No-one. Very sad. :('}`
}

module.exports.resetHendz = (interaction) => {
  hendz = []
  return 'Hendz have been reset'
}
