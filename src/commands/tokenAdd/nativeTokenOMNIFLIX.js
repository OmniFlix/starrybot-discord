module.exports = {
    nativeTokenOMNIFLIX: {
        stateOnEnter: {
            tokenAddress: 'flix',
            tokenSymbol: 'flix',
            network: 'mainnet',
        },
        next: 'promptTokenAmount',
        prompt: {
            type: 'input',
            title: 'How many native tokens?',
            description: 'Please enter the number of tokens a user must have to get a special role.',
        }
    }
}
