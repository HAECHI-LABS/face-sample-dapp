// NOTE: status는 일반 node에서 조회가 안됨
import { Network } from '@haechi-labs/face-types';

export const config = (network) => {
  return network === Network.NEAR
    ? {
        networkId: 'mainnet',
        nodeUrl: 'https://rpc.mainnet.near.org',
      }
    : {
        networkId: 'testnet',
        nodeUrl: 'https://rpc.testnet.near.org',
      };
};
