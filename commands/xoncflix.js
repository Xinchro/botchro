module.exports.getEvents = async function (guild) {
  let eventsEmbed = {
    color: 0x0099ff,
    title: 'Xoncflix™ Entertainment Events',
    footer: { text: "Powered by salt.", icon_url: "https://xinchronize.com/assets/logo.png" }
  }
  const events = await guild.scheduledEvents.fetch()


  let filteredEvents = events.filter(event => event.name.toLowerCase().startsWith('xoncflix'))
  events.filter(event => event.name.toLowerCase().startsWith('time™')).forEach(event => filteredEvents.set(event.id, event))

  if (filteredEvents.size === 0) {
    return {
      ...eventsEmbed,
      title: 'Xoncflix™ Entertainment Events - Currently Closed',
      description: 'There are no events scheduled. Very sad.'
    }
  }

  let fields = await Promise.all(filteredEvents.map(async event => {
    let fieldValue = ''
    fieldValue += event.description ? `${event.description}\n` : ''
    fieldValue += event.scheduledStartTimestamp ? `\n<t:${parseInt(event.scheduledStartTimestamp/1000)}:f>\n` : ''
    fieldValue += event.scheduledStartTimestamp ? `\n<t:${parseInt(event.scheduledStartTimestamp/1000)}:R>\n` : ''

    let users = Array.from(await event.fetchSubscribers()) // Map to array to get only usernames easier

    fieldValue += `\nAttending: ${event.userCount}
    ${users.map(userObj => {
      return `${guild.members.cache.get(userObj[1].user.id).nickname}`
    }).join(', ')}`

    return {
      name: event.name,
      value: fieldValue,
      inline: true
    }
  }))

  return {
    ...eventsEmbed,
    description: `There are ${filteredEvents.size} event(s) scheduled.`,
    fields
  }
}
