let hendz = []

module.exports.hendzHandler = (interaction) => {
  if(!interaction.options.getString('what')) return "nope"
  switch(interaction.options.getString('what')) {
    case 'show':
      return this.showHend(interaction)
    case 'hide':
      return this.hideHend(interaction)
    case 'peek':
      return this.getHendz(interaction)
    case 'reset':
      return this.resetHendz(interaction)
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