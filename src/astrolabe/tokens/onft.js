const omniflixjs = require("omniflix-nfts");
const { getConnectionFromPrefix, getConnectionFromToken, getPrefixFromToken } = require('../networks')
const { Bech32 } = require("@cosmjs/encoding");

const checkForONFT = async (onftInput, lcdEndpoint) => {
    return await omniflixjs.getCollection(lcdEndpoint, onftInput);
}

const attemptONFTLookup = async (onftInput, network) => {
    let lcdEndpoint = getConnectionFromToken(onftInput, 'lcd', network)
    return await checkForONFT(onftInput, lcdEndpoint)
}

const getTokenInfo = async ({ tokenAddress, network }) => {
    let tokenInfo;

    // If they defined network use it
    if (network) {
        tokenInfo = await attemptONFTLookup(tokenAddress, network)
    } else {
        // No network defined, check for existence on mainnet then testnet
        network = 'mainnet';
        try {
            tokenInfo = await attemptONFTLookup(tokenAddress, network)
        } catch {
            // Nothing was found on mainnet but this could still be on testnet,
            // so swallow the error and try testnet instead
            network = 'testnet'
            tokenInfo = await attemptONFTLookup(tokenAddress, network)
        }
    }
    return { token: tokenInfo, network }
}

const getONFTTokenDetails = async ({tokenAddress, network}) => {
    let tokenInfo = await getTokenInfo({tokenAddress, network})
    if (tokenInfo.token === null) throw 'Could not get collection details';
    return {
        network: tokenInfo.network,
        onft: tokenAddress,
        tokenType: 'onft',
        tokenSymbol: tokenInfo.token.symbol,
        decimals: null, // keep null
    }
}

const getStakedONFTTokenBalance = async ({keplrAccount, tokenAddress, network, extra}) => {
    // At the time of this writing, there is no NFT staking, so always return 0
    return 0
}

const getONFTTokenBalance = async ({keplrAccount, tokenAddress, network, extra}) => {
    // Given the wallet address, NFT collection address,
    // and the network it's on, do the math for the following correctly
    const decodedAccount = Bech32.decode(keplrAccount).data;
    const prefix = getPrefixFromToken(tokenAddress);
    if (!prefix) throw 'Could not determine prefix';

    const encodedAccount = Bech32.encode(prefix, decodedAccount);
    const lcdEndpoint = getConnectionFromPrefix(prefix, 'lcd', network);
    const nftsOwned = await omniflixjs.getNumOfNftsOwned(lcdEndpoint, tokenAddress, encodedAccount)
    const listingsOwned = await omniflixjs.getNumOfListingsOwned(lcdEndpoint, tokenAddress, encodedAccount)
    return nftsOwned + listingsOwned
}

const isONFT = async (tokenAddress, network) => {
    if (!tokenAddress || !tokenAddress.startsWith('onftdenom')) {
        return false
    }
    let tokenInfo = await getTokenInfo({tokenAddress, network})
    // Expecting this format for tokenInfo.token:
    // { name: 'Passage Marketplace', symbol: 'yawp' }
    return tokenInfo.token &&
        tokenInfo.token.hasOwnProperty('name') &&
        tokenInfo.token.hasOwnProperty('symbol');
}

module.exports = {
    onft: {
        name: 'ONFT',
        isTokenType: isONFT,
        getTokenBalance: getONFTTokenBalance,
        getStakedTokenBalance: getStakedONFTTokenBalance,
        getTokenDetails: getONFTTokenDetails,
    }
}
