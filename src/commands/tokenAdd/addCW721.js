module.exports = {
  addCW721: {
    name: 'addCW721',
    config: {
      prompt: {
        type: 'reaction',
        title: 'Tell us about your token',
        options: [
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
      }
    }
  }
}
