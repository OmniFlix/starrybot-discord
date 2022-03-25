const { buildBasicMessageCommand } = require('../../utils/commands');

module.exports = {
  nativeTokenJUNO: {
    name: 'nativeTokenJUNO',
    config: async (req, res, ctx, next) => {
      ctx.tokenAddress = 'juno'
      ctx.tokenSymbol = 'juno'
      ctx.network = 'mainnet'

      return {
        embeds: [
          {
            title: 'How many native tokens?',
            description: 'Please enter the number of tokens a user must have to get a special role.',
          }
        ],
        next: 'promptTokenAmount',
      }
    }
  }
}
