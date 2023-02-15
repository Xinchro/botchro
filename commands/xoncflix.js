const { timeDifference } = require('../utils')

module.exports.getEvents = async function (guild) {
  let eventsEmbed = {
    color: 0x0099ff,
    title: 'Xoncflix™ Entertainment Events',
    footer: { text: "Powered by salt.", icon_url: "https://xinchronize.com/assets/logo.png" }
  }
  return guild.scheduledEvents.fetch().then(
    events => {
      let xoncflixEvents = events.filter(event => event.name.toLowerCase().startsWith('xoncflix'))
      let timeTmEvents = events.filter(event => event.name.toLowerCase().startsWith('time™'))

      let eventFields = []

      eventFields.push(...xoncflixEvents.map(event => {
        let fieldValue = ''
        fieldValue += event.description ? `${event.description}\n` : ''
        fieldValue += event.scheduledStartTimestamp ? `\n${new Date(event.scheduledStartTimestamp).toISOString().replace('T', ' ').replace('Z', '\n').trimEnd()}\n` : ''
        fieldValue += event.scheduledStartTimestamp ? `\n${timeDifference(new Date(), event.scheduledStartTimestamp)}\n` : ''

        return {
          name: event.name,
          value: fieldValue,
          inline: true
        }
      }))

      eventFields.push(...timeTmEvents.map(event => {
        let fieldValue = ''
        fieldValue += event.description ? `${event.description}\n` : ''
        fieldValue += event.scheduledStartTimestamp ? `\n${new Date(event.scheduledStartTimestamp).toISOString().replace('T', ' ').replace('Z', '\n').trimEnd()}\n` : ''
        fieldValue += event.scheduledStartTimestamp ? `\n${timeDifference(new Date(), event.scheduledStartTimestamp)}\n` : ''

        return {
          name: event.name,
          value: fieldValue,
          inline: true
        }
      }))

      if (xoncflixEvents.size + timeTmEvents.size === 0) {
        return {
          ...eventsEmbed,
          title: 'Xoncflix™ Entertainment Events - Currently Closed',
          description: 'There are no events scheduled. Very sad.'
        }
      }

      return {
        ...eventsEmbed,
        description: `There are ${xoncflixEvents.size + timeTmEvents.size} event(s) scheduled.`,
        fields: [...eventFields]
      }
    }
  )
}