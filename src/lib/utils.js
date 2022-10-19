import { Network } from '@haechi-labs/face-sdk';
import { ethers } from 'ethers';

import { ERC20_ABI, ERC721_TRANSFER_ABI } from './abi';

export function makeErc20Data(functionFragment, to, value) {
  const ethersInterface = new ethers.utils.Interface(ERC20_ABI);
  return ethersInterface.encodeFunctionData(functionFragment, [to, value]);
}

export function makeErc721Data(functionFragment, from, to, tokenId) {
  const ethersInterface = new ethers.utils.Interface(ERC721_TRANSFER_ABI);
  return ethersInterface.encodeFunctionData(functionFragment, [from, to, tokenId]);
}

export function getExplorerUrl(network) {
  const explorerMap = {
    [Network.GOERLI]: 'https://goerli.etherscan.io/tx/',
    [Network.ETHEREUM]: 'https://etherscan.io/tx/',
    [Network.MUMBAI]: 'https://mumbai.polygonscan.com/tx/',
    [Network.POLYGON]: 'https://polygonscan.com/tx/',
    [Network.BNB_SMART_CHAIN_TESTNET]: 'https://testnet.bscscan.com/tx/',
    [Network.BNB_SMART_CHAIN]: 'https://bscscan.com/tx/',
    [Network.BAOBAB]: 'https://baobab.klaytnfinder.io/tx/',
    [Network.KLAYTN]: 'https://www.klaytnfinder.io/tx/',
    [Network.BORA]: 'https://scope.boraportal.com/tx/',
    [Network.BORA_TESTNET]: 'https://scope.boraportal.com/tx/',
  };

  return explorerMap[network];
}
