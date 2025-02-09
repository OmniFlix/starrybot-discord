module.exports = {
    promptNativeToken: {
        deferReply: false, // Required for type modal
        getConfig: async (state) => {
            // See which button they pressed and update the state appropriatley
            const selectedToken = state.interactionTarget.customId;
            console.log(selectedToken);
            switch (selectedToken) {
                case 'omniflix':
                    state.tokenAddress = 'omniflix';
                    state.tokenSymbol = 'flix';
                    state.network = 'mainnet';
                    break;
                case 'juno':
                    state.tokenAddress = 'juno';
                    state.tokenSymbol = 'juno';
                    state.network = 'mainnet';
                    break;
                case 'stars':
                    state.tokenAddress = 'stars';
                    state.tokenSymbol = 'stars';
                    state.network = 'mainnet';
                    break;
                case 'suggestion':
                default:
                    // They picked the "suggest another" option
                    return {
                        message: '🌟 Please fill out this form, friend:\n\nhttps://sfg8dsaynp1.typeform.com/to/RvAbowUd',
                    }
            }

            return {
                next: 'createTokenRule',
                prompt: {
                    type: 'modal',
                    title: `Configure ${selectedToken.toUpperCase()} Token Rule`,
                    inputs: [
                        {
                            label: 'Role Name',
                            placeholder: 'Please enter the name of the role that should created',
                            id: 'role-name',
                            required: true,
                        },
                        {
                            label: 'Token Amount',
                            placeholder: 'Please enter the number of tokens a user must have to get a special role',
                            id: 'token-amount',
                            required: true,
                        }
                    ]
                }
            }
        }
    }
}
