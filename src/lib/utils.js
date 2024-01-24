import { Network } from '@haechi-labs/face-sdk';
import BN from 'bn.js';
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
    [Network.SEPOLIA]: 'https://sepolia.etherscan.io/tx/',
    [Network.ETHEREUM]: 'https://etherscan.io/tx/',
    [Network.MUMBAI]: 'https://mumbai.polygonscan.com/tx/',
    [Network.POLYGON]: 'https://polygonscan.com/tx/',
    [Network.BNB_SMART_CHAIN_TESTNET]: 'https://testnet.bscscan.com/tx/',
    [Network.BNB_SMART_CHAIN]: 'https://bscscan.com/tx/',
    [Network.BAOBAB]: 'https://baobab.klaytnfinder.io/tx/',
    [Network.KLAYTN]: 'https://www.klaytnfinder.io/tx/',
    [Network.BORA]: 'https://scope.boraportal.com/tx/',
    [Network.BORA_TESTNET]: 'https://scope.boraportal.com/tx/',
    [Network.NEAR]: 'https://explorer.near.org/transactions/tx}',
    [Network.NEAR_TESTNET]: 'https://explorer.testnet.near.org/transactions/tx',
  };

  return explorerMap[network];
}

export function getProvider(network) {
  switch (network) {
    case Network.ROPSTEN:
      return 'https://eth-ropsten.alchemyapi.io/v2/UghLajTzDNBAO9EByRXWmIqduze2_jJ2';
    case Network.SEPOLIA:
      return 'https://rpc.sepolia.org';
    case Network.ETHEREUM:
      return 'https://mainnet.infura.io/v3/';
    case Network.MUMBAI:
      return 'https://matic-mumbai.chainstacklabs.com';
    case Network.POLYGON:
      return 'https://polygon-rpc.com/';
    case Network.BNB_SMART_CHAIN:
      return 'https://bsc-dataseed.binance.org/';
    case Network.BNB_SMART_CHAIN_TESTNET:
      return 'https://data-seed-prebsc-1-s1.binance.org:8545/';
    case Network.KLAYTN:
      return 'https://public-node-api.klaytnapi.com/v1/cypress';
    case Network.BAOBAB:
      return 'https://api.baobab.klaytn.net:8651/';
    case Network.BORA:
      return 'https://bora-mainnet.haechi.io';
    case Network.BORA_TESTNET:
      return 'https://bora-testnet.haechi.io';
    case Network.SOLANA_DEVNET:
      return 'https://api.devnet.solana.com';
    case Network.SOLANA:
      return 'https://api.mainnet-beta.solana.com';
    case Network.NEAR:
      return 'https://rpc.mainnet.near.org';
    case Network.NEAR_TESTNET:
      return 'https://rpc.testnet.near.org';
    case Network.APTOS:
      return 'https://fullnode.mainnet.aptoslabs.com/v1';
    case Network.APTOS_TESTNET:
      return 'https://fullnode.testnet.aptoslabs.com/v1';
    case Network.MEVERSE:
      return 'https://rpc.meversemainnet.io';
    case Network.MEVERSE_TESTNET:
      return 'https://rpc.meversetestnet.io';
    case Network.PSM_TESTNET:
    case Network.PSM_TESTNET_TEST:
    case Network.PSM_TESTNET_DEV:
      throw Error(`cannot resolve node url with network : ${network}`);
    case Network.HOME_VERSE:
      return 'https://rpc.mainnet.oasys.homeverse.games';
    case Network.HOME_VERSE_TESTNET:
      return 'https://rpc.testnet.oasys.homeverse.games';
    case Network.YOOLDO_VERSE:
      return 'https://rpc.yooldo-verse.xyz';
    case Network.YOOLDO_VERSE_TESTNET:
      return 'https://rpc.sandverse.oasys.games';
    case Network.OASYS:
      return 'https://rpc.mainnet.oasys.games';
    case Network.OASYS_TESTNET:
      return 'https://rpc.testnet.oasys.games';
    default:
      throw Error(`cannot resolve provider with network : ${network}`);
  }
}

export function calcNearTgas(tgas) {
  // 1 tgas == 0.0001 near
  // 1 tgas === 1000000000000 BN
  tgas *= 1000000000000;
  return new BN(`${tgas}`, 10);
}
