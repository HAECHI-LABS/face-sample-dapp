import { providers, utils } from 'ethers';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';

import { faceAtom } from '../store';
import { accountAtom } from '../store/accountAtom';
import Box from './common/Box';
import Message from './common/Message';

const title = 'Platform Coin Transaction';
function TransactionPlatformCoin() {
  const face = useRecoilValue(faceAtom);
  const account = useRecoilValue(accountAtom);
  const [txHash, setTxHash] = useState('');

  async function sendTransaction() {
    const provider = new providers.Web3Provider(face.getEthLikeProvider(), 'any');

    const signer = await provider.getSigner();
    const result = await signer.sendTransaction({
      to: await signer.getAddress(),
      value: utils.parseEther('0.0001'),
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
      <button className="button" onClick={sendTransaction}>
        Transfer 0.0001 ETH to me
      </button>
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

export default TransactionPlatformCoin;
