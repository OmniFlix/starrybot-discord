const { buildBasicMessageCommand } = require('../../utils/commands');

module.exports = {
  addCW721: {
    name: 'addCW721',
    execute: buildBasicMessageCommand({
      color: '#FDC2A0',
      title: 'Tell us about your token',
      emojiOptions: [
        {
          emoji: '🖼',
          description: 'I have the token address',
          next: 'hasCW721',
        },
        {
          emoji: '💫',
          description: 'I have the Stargaze Launchpad URL',
          next: 'stargaze',
        },
      ]
    })
  }
}
