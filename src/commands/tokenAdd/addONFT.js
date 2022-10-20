module.exports = {
    addONFT: {
        next: 'promptONFT',
        prompt: {
            type: 'button',
            title: 'Tell us about your token',
            embeds: [
                {
                    title: 'Learning about OmniFlix collection',
                    description: 'This info will help you understand your options.',
                    fields: [
                        {
                            name: 'Explain OmniFlix Tokens',
                            value: 'OmniFlix collection/denom address is a unique address, look something like this: onftdenom.....',
                        },
                    ]
                }
            ],
            options: [
                {
                    label: '🎨 I have a OmniFlix collection address',
                    value: 'ONFT',
                },
                {
                    label: '💫  I have a OmniFlix Collection URL',
                    value: 'OmniFlix',
                },
            ]
        }
    }
}
