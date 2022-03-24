const { buildBasicMessageCommand } = require('../../utils/commands');

module.exports = {
  hasCW20: {
    name: 'hasCW20',
    execute: buildBasicMessageCommand({
      embeds: [
        {
          color: '#FDC2A0',
          title: 'Enter your token address',
          description: 'Please write your cw20 token address in Discord chat…',
        }
      ],
      next: 'handleCW20Entry',
    })
  }
}
