module.exports = {
    handleONFTEntry: {
        getConfig: async (
            args,
            {
                astrolabe: { getTokenDetails },
            }
        ) => {
            const { userInput } = args;
            // If user has done something else (like emoji reaction) do nothing
            if (!userInput) return;

            let results;
            try {
                results = await getTokenDetails({ tokenAddress: userInput });

                args.tokenAddress = results.onft;
                args.network = results.network;
                args.tokenType = results.tokenType;
                args.tokenSymbol = results.tokenSymbol;
                args.minimumTokensNeeded = 1;
                args.decimals = results.decimals;
            } catch (error) {
                // Notify the channel with whatever went wrong in this step
                return { error };
            }

            return {
                next: 'promptTokenName',
                prompt: {
                    type: 'input',
                    title: 'What is the role name?',
                    description: `Please enter the name of the role that should be given to users with at least 1 NFT from this collection.`,
                    footer: 'Note: this role will be created automatically',
                }
            }
        }
    }
}
