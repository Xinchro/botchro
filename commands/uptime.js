module.exports.getUptime = function () {
  const uptime = process.uptime()
  const days = Math.floor(uptime / 86400)
  const hours = Math.floor(uptime / 3600) % 24
  const minutes = Math.floor(uptime / 60) % 60
  const seconds = Math.floor(uptime % 60)
  return `${days}d ${hours}h ${minutes}m ${seconds}s`
}
