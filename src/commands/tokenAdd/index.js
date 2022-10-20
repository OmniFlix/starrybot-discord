// const { addCW20 } = require('./addCW20');
// const { addCW721 } = require('./addCW721');
const { addONFT } = require('./addONFT');
const { addNativeToken } = require('./addNativeToken');
// const { daoDao } = require('./daoDao');
// const { explainTokenTypes } = require('./explainTokenTypes');
// const { handleCW20Entry } = require('./handleCW20Entry');
// const { handleCW721Entry } = require('./handleCW721Entry');
const { handleONFTEntry } = require('./handleONFTEntry');
// const { hasCW20 } = require('./hasCW20');
// const { hasCW721 } = require('./hasCW721');
const { hasONFT } = require('./hasONFT');
const { nativeTokenOMNIFLIX } = require('./nativeTokenOMNIFLIX');
// const { nativeTokenSuggestion } = require('./nativeTokenSuggestion');
// const { needsCW20 } = require('./needsCW20');
const { promptNativeToken } = require('./promptNativeToken');
const { promptTokenAmount } = require('./promptTokenAmount');
const { promptTokenName } = require('./promptTokenName');
const { promptONFT } = require('./promptONFT');
const { createTokenRule } = require('./createTokenRule');
const { handleRoleCreate } = require('./handleRoleCreate');
// const { stargaze } = require('./stargaze');

module.exports = {
  starryCommandTokenAdd: {
    adminOnly: true,
    name: 'add',
    description: 'Add a new token rule',
    prompt: {
      type: 'select',
      title: 'What kind of token?',
      options: [
        {
          label: '🔗 Native Token',
          description: 'E.g. Juno for the Juno chain.',
          next: 'addNativeToken',
        },
 /*       {
          emoji: '📜',
          description: 'A cw20 fungible token',
          next: 'addCW20',
        },
        {
          emoji: '🖼',
          description: 'A cw721 non-fungible token (Beta)',
          next: 'addCW721',
        },*/

        {
          label: '🖼 OmniFlix NFT',
          description: 'An OmniFlix non-fungible token',
          next: 'addONFT',
        }
      ]
    },
    steps: {
      // addCW20,
      // addCW721,
      addONFT,
      addNativeToken,
      // daoDao,
      // explainTokenTypes,
      // handleCW20Entry,
      // handleCW721Entry,
      handleONFTEntry,
      // hasCW20,
      // hasCW721,
      hasONFT,
      nativeTokenOMNIFLIX,
      // nativeTokenSuggestion,
      // needsCW20,
      // stargaze,
      promptONFT,
      promptNativeToken,
      promptTokenAmount,
      promptTokenName,
      createTokenRule,
      handleRoleCreate,
    }
  }
}
