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




