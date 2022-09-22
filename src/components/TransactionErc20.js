import { Network } from '@haechi-labs/face-sdk';
import { providers, utils } from 'ethers';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';

import { makeERC20Data } from '../lib/utils';
import { faceAtom } from '../store';
import { accountAtom } from '../store/accountAtom';
import { networkAtom } from '../store/networkAtom';
import Box from './common/Box';
import Button from './common/Button';
import Message from './common/Message';

const erc20ContractDataMap = {
  [Network.ETH_MAINNET]: { symbol: 'EVT', address: '0x8A904F0Fb443D62B6A2835483b087aBECF93a137' },
  [Network.ETH_TESTNET]: { symbol: 'FCT', address: '0x6558820324875d2747a32B7D37496fd473AD7648' },
  [Network.MATIC_MAINNET]: { symbol: 'FCT', address: '0xfce04dd232006d0da001f6d54bb5a7fc969dbc08' },
  [Network.MATIC_TESTNET]: { symbol: 'FCT', address: '0xfce04dd232006d0da001f6d54bb5a7fc969dbc08' },
};

const title = 'ERC20 Transaction';
function TransactionErc20() {
  const face = useRecoilValue(faceAtom);
  const account = useRecoilValue(accountAtom);
  const network = useRecoilValue(networkAtom);
  const [txHash, setTxHash] = useState('');

  async function sendTransaction() {
    const provider = new providers.Web3Provider(face.getEthLikeProvider(), 'any');

    const signer = await provider.getSigner();
    const myAddress = await signer.getAddress();
    const result = await signer.sendTransaction({
      to: erc20ContractDataMap[network].address,
      value: '0x0',
      data: makeERC20Data(
        erc20ContractDataMap[network].address,
        myAddress,
        utils.parseUnits('0.0001')
      ),
    });

    setTxHash(result.hash);

    console.group('[Transaction Information]');
    console.log('Transaction info:', result);
    console.log('Ropsten Link:', `https://ropsten.etherscan.io/tx/${result.hash}`);
    console.groupEnd();
  }

  if (!face) {
    return (
      <Box title={title}>
        <Message type="danger">You must connect to the network first.</Message>
      </Box>
    );
  }
  if (!account.balance || !account.address) {
    return (
      <Box title={title}>
        <Message type="danger">You must log in and get account first.</Message>
      </Box>
    );
  }

  return (
    <Box title={title}>
      <input className="input" />
      <Button onClick={sendTransaction}>
        Transfer 0.0001 {erc20ContractDataMap[network].symbol} to me
      </Button>
      {txHash && (
        <>
          <Message type="info">Hash: {txHash}</Message>
          <Message type="info">
            <a
              href={`https://ropsten.etherscan.io/tx/${txHash}`}
              rel="noopener noreferrer"
              target="_blank">
              Ropsten Link
            </a>
          </Message>
        </>
      )}
    </Box>
  );
}

export default TransactionErc20;
