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
    [Network.ETH_TESTNET]: 'https://ropsten.etherscan.io/tx/',
    [Network.ETH_MAINNET]: 'https://etherscan.io/tx/',
    [Network.MATIC_TESTNET]: 'https://mumbai.polygonscan.com/tx/',
    [Network.MATIC_MAINNET]: 'https://polygonscan.com/tx/',
    [Network.BINANCE_COIN_MAINNET]: 'https://bscscan.com/tx/',
    [Network.BINANCE_COIN_TESTNET]: 'https://testnet.bscscan.com/tx/',
    [Network.KLAYTN_MAINNET]: 'https://www.klaytnfinder.io/tx/',
    [Network.KLAYTN_TESTNET]: 'https://baobab.klaytnfinder.io/tx/',
  };

  return explorerMap[network];
}
