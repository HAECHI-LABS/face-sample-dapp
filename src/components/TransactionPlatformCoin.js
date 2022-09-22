import { useState } from 'react';
import { providers, utils } from 'ethers';
import { useRecoilValue } from 'recoil';

import Box from './Box';
import { faceAtom } from '../store';
import { accountAtom } from '../store/accountAtom';

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
        <div className="alert danger">You must connect to the network first.</div>
      </Box>
    );
  }
  if (!account.balance || !account.address) {
    return (
      <Box title={title}>
        <div className="alert danger">You must log in and get account first.</div>
      </Box>
    );
  }

  return (
    <Box title={title}>
      <button onClick={sendTransaction}>Transfer 0.0001 ETH to me</button>
      {txHash && (
        <>
          <div className="alert info">Hash: {txHash}</div>
          <div className="alert info">
            <a
              href={`https://ropsten.etherscan.io/tx/${txHash}`}
              rel="noopener noreferrer"
              target="_blank">
              Ropsten Link
            </a>
          </div>
        </>
      )}
    </Box>
  );
}

export default TransactionPlatformCoin;
