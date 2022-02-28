const { CosmWasmClient } = require("@cosmjs/cosmwasm-stargate");
const { Bech32 } = require('@cosmjs/encoding')
const { getConnectionFromPrefix, getConnectionFromToken, getPrefixFromToken } = require('./networks')

const checkForCW20 = async (cosmClient, cw20Input) => {
  return cosmClient.queryContractSmart(cw20Input, {
    token_info: { },
  });
}

const getCW20TokenDetails = async (cw20Input) => {
  let network = 'mainnet';
  // Check user's cw20 token for existence on mainnet then testnet
  let rpcEndpoint = getConnectionFromToken(cw20Input, 'rpc', 'mainnet')
  let cosmClient = await CosmWasmClient.connect(rpcEndpoint)
  let tokenInfo;
  try {
    tokenInfo = await checkForCW20(cosmClient, cw20Input)
  } catch {
    // Nothing was found on mainnet but this could still be on testnet,
    // so swallow the error and try testnet instead
    network = 'testnet'
    rpcEndpoint = getConnectionFromToken(cw20Input, 'rpc', network)
    cosmClient = await CosmWasmClient.connect(rpcEndpoint)
    tokenInfo = await checkForCW20(cosmClient, cw20Input)
  }

  return {
    network,
    cw20Input,
    tokenType: 'cw20',
    tokenSymbol: tokenInfo.symbol,
    decimals: tokenInfo.decimals,
  }
}

const getCW20TokenBalance = async (keplrAccount, tokenAddress, network) => {
  const decodedAccount = Bech32.decode(keplrAccount).data;
  const prefix = getPrefixFromToken(tokenAddress);
  if (!prefix) throw 'Could not determine prefix';

  const encodedAccount = Bech32.encode(prefix, decodedAccount);
  const rpcEndpoint = getConnectionFromPrefix(prefix, 'rpc', network);
  const cosmClient = await CosmWasmClient.connect(rpcEndpoint);
  const smartContract = await cosmClient.queryContractSmart(tokenAddress, {
    balance: {
      address: encodedAccount,
    }
  });

  return parseInt(smartContract.balance);
}

module.exports = {
  // Used by Daodao's getTokenDetails
  checkForCW20,

  cw20: {
    name: 'CW20',
    isTokenType: () => true, // TO-DO: is there a way to tell?
    checkFor: checkForCW20,
    getTokenBalance: getCW20TokenBalance,
    getTokenDetails: getCW20TokenDetails,
    getTokenRpcEndpoint: (tokenAddress, network) => getConnectionFromToken(tokenAddress, 'rpc', network)
  }
}
