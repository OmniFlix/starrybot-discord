const omniflixjs = require("omniflix-nfts");
const { getConnectionFromToken } = require('./networks')

const isOmniFlixCollectionAddress = omniflixUrl => {
    const omniflixCollectionRegex = /^https:\/\/omniflix.market\/collection\/(onftdenom\w*)/;
    return omniflixUrl.match(omniflixCollectionRegex);
}

const getCollectionFromOmniFlixCollectionUrl = async omniflixUrl => {
    const omniflixCollectionRegex = /^https:\/\/omniflix.market\/collection\/(onftdenom\w*)/;
    const regexMatches = omniflixCollectionRegex.exec(omniflixUrl);
    // [0] is the string itself, [1] is the (\w*) capture group
    const collectionAddress = regexMatches[1];

    // No network defined, check for existence on mainnet then testnet
    let network = 'mainnet';
    let config, lcdEndPoint;
    try {
        lcdEndPoint = getConnectionFromToken(collectionAddress, 'lcd', network)
        config = await omniflixjs.isCollectionExists(lcdEndPoint, collectionAddress)
    } catch {
        // Nothing was found on mainnet but this could still be on testnet,
        // so swallow the error and try testnet instead
        network = 'testnet'
        lcdEndPoint = getConnectionFromToken(collectionAddress, 'lcd', network)
        config = await omniflixjs.isCollectionExists(lcdEndPoint, collectionAddress)
    }
    return config.id;
}

const getCollectionFromOmniFlixUrl = async omniflixUrl => {
    if (!isOmniFlixCollectionAddress(omniflixUrl)) return;

    return await getCollectionFromOmniFlixCollectionUrl(omniflixUrl);
}

module.exports = {
    isOmniFlixCollectionAddress,
    getCollectionFromOmniFlixUrl,
}
