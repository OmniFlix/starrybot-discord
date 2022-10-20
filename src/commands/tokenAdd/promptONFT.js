module.exports = {
    promptONFT: {
        deferReply: false, // Required for type modal
        getConfig: async (state) => {
            // See which button they pressed and update the state appropriatley
            const selectedOption = state.interactionTarget.customId;
            state.selectedOption = selectedOption;

            return {
                next: 'createTokenRule',
                prompt: {
                    type: 'modal',
                    title: `Configure ${selectedOption} Token Rule`,
                    inputs: [
                        {
                            label: selectedOption === 'ONFT' ? 'Collection Address' : 'OmniFlix marketplace URL',
                            placeholder: selectedOption === 'ONFT' ?
                                'Please enter the OmniFlix collection address' :
                                "Paste the OmniFlix Marktplace URL of the collection and we can do the rest!",
                            id: 'token-address',
                            required: true,
                        },
                        {
                            label: 'Role Name',
                            placeholder: 'Please enter the name of the role that should created',
                            id: 'role-name',
                            required: true,
                        },
                    ]
                }
            }
        }
    }
}
