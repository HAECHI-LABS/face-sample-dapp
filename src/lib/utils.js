import { ethers } from 'ethers';

import { ERC20_TRANSFER_ABI, ERC721_TRANSFER_ABI } from './abi';

export function makeErc20Data(functionFragment, to, value) {
  const ethersInterface = new ethers.utils.Interface(ERC20_TRANSFER_ABI);
  return ethersInterface.encodeFunctionData(functionFragment, [to, value]);
}

export function makeErc721Data(functionFragment, from, to, tokenId) {
  const ethersInterface = new ethers.utils.Interface(ERC721_TRANSFER_ABI);
  return ethersInterface.encodeFunctionData(functionFragment, [from, to, tokenId]);
}
