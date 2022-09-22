import { ethers } from 'ethers';
import { ERC20_TRANSFER_ABI } from './abi';

export function makeERC20Data(functionFragment, to, value) {
  const ethersInterface = new ethers.utils.Interface(ERC20_TRANSFER_ABI);
  return ethersInterface.encodeFunctionData('transfer', [to, value]);
}
