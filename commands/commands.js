module.exports.commands = [
  {
    name: 'yay',
    description: 'YyyaaAaAAaaYYyy'
  },
  {
    name: 'aah',
    description: 'AAAAAaaaaAAAAhhhh...'
  },
  {
    name: 'uptime',
    description: 'Shows the uptime of the bot'
  },
  {
    name: 'hello',
    description: 'Bot information'
  },
  {
    name: 'xoncflix',
    description: 'Next Xoncflix'
  },
  {
    name: 'hendz',
    description: 'Hendz actions',
    options: [
      {
        name: 'show',
        description: 'Show your hend',
        type: 1
      },
      {
        name: 'hide',
        description: 'Hide your hend',
        type: 1
      },
      {
        name: 'peek',
        description: 'Peek at hendz',
        type: 1
      },
      {
        name: 'reset',
        description: 'Reset hendz',
        type: 1
      }
    ]
  },
  {
    name: 'timevids',
    description: 'TimeVids actions',
    options: [
      {
        name: 'add',
        description: 'Add a video to the queue',
        type: 1,
        options: [
          {
            name: 'url',
            description: 'URL of the video',
            type: 3,
            required: true
          }
        ]
      },
      {
        name: 'remove',
        description: 'Remove a video from the queue',
        type: 1,
        options: [
          {
            name: 'url',
            description: 'URL of the video',
            type: 3,
            required: true
          }
        ]
      },
      {
        name: 'list',
        description: 'List all videos in the queue',
        type: 1
      },
      {
        name: 'clear',
        description: 'Clear all videos from the queue',
        type: 1
      }
    ]
  },
  {
    name: 'character',
    description: 'Custom character commands',
    options: [
      {
        name: 'set',
        description: 'Set your character style',
        type: 1,
        options: [
          {
            name: 'code',
            description: 'The code of your character customization',
            type: 3,
            required: true
          }
        ]
      },
      {
        name: 'check',
        description: 'Check your character style',
        type: 1
      },
      {
        name: 'remove',
        description: 'Remove your character customization',
        type: 1
      }
    ]
  }
]