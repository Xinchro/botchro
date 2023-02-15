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
  const { execSync } = require('child_process')
  const commitTime = this.formatDateTime(execSync('git log master -1 --format=%cd').toString())
  return commitTime
}

module.exports.getLastCommitMessage = () => {
  const { execSync } = require('child_process')
  const commitMessage = execSync('git log master -1 --format=%s').toString().trimEnd()
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