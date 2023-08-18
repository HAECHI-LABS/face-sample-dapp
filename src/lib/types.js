import {
  Blockchain,
  getPlatFormCoinDecimalByBlockchain,
  isEthlikeBlockchain,
} from '@haechi-labs/face-types';
import { ethers } from 'ethers';

export class Coin {
  constructor({ data, decimal }) {
    this.data = data;
    this.decimal = decimal;
  }

  toHexAmount() {
    return this.data.toHexString();
  }

  toDecimalAmountAsNumber() {
    return this.data.toNumber();
  }

  toDecimalAmountAsString() {
    return this.data.toString();
  }
}

export function createPlatformCoin(amount, blockchain) {
  if (isEthlikeBlockchain(blockchain)) {
    return createEthCoin(amount);
  } else {
    return createNonEthCoin(amount, blockchain);
  }
}

/**
 * @param amount 0.01 같은 값
 */
function createEthCoin(amount) {
  return new Coin({
    data: ethers.utils.parseEther(amount),
    decimal: 18,
  });
}

/**
 * @param amount 0.01 같은 값
 */
function createNonEthCoin(amount, blockchain) {
  const decimal = getPlatFormCoinDecimalByBlockchain(blockchain);
  return new Coin({
    data: ethers.utils.parseUnits(amount, decimal),
    decimal: decimal,
  });
}

export function createLargeDecimalFT(amount, blockchain) {
  if (isEthlikeBlockchain(blockchain)) {
    return new Coin({
      data: ethers.utils.parseEther(amount),
      decimal: 18,
    });
  }
  if (Blockchain.SOLANA === blockchain) {
    return new Coin({
      data: ethers.utils.parseUnits(amount, 9),
      decimal: 9,
    });
  }

  if (Blockchain.NEAR === blockchain) {
    return new Coin({
      data: ethers.utils.parseUnits(amount, 18),
      decimal: 18,
    });
  }

  throw new Error('unknown blockchain for faucet');
}
