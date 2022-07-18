module.exports = {
    addONFT: {
        prompt: {
            type: 'reaction',
            title: 'Tell us about your token',
            options: [
                {
                    emoji: '🔥',
                    description: 'I have the collection address',
                    next: 'hasONFT',
                },
            ]
        }
    }
}
