import {
  getPlatFormCoinDecimalByBlockchain,
  isEthlikeBlockchain,
  networkToBlockchain,
} from '@haechi-labs/face-types';
import { utils } from 'ethers';

export function formatPlatformCoin(balance, network) {
  const blockchain = networkToBlockchain(network);
  if (isEthlikeBlockchain(blockchain)) {
    return utils.formatEther(balance);
  } else {
    return utils.formatUnits(balance, getPlatFormCoinDecimalByBlockchain(blockchain));
  }
}
