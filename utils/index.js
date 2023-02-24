const { execSync } = require('child_process')

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
