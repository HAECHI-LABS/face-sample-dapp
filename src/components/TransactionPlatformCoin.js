import { providers, utils } from 'ethers';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { getExplorerUrl } from '../lib/utils';
import { faceAtom } from '../store';
import { accountAtom } from '../store/accountAtom';
import { networkAtom } from '../store/networkAtom';
import Box from './common/Box';
import Button from './common/Button';
import Field from './common/Field';
import Message from './common/Message';

const title = 'Coin Transaction';
function TransactionPlatformCoin() {
  const face = useRecoilValue(faceAtom);
  const account = useRecoilValue(accountAtom);
  const network = useRecoilValue(networkAtom);
  const [txHash, setTxHash] = useState('');
  const [amount, setAmount] = useState('0.001');
  const [receiverAddress, setReceiverAddress] = useState('');

  useEffect(() => {
    // Set receiver to user account
    if (account.address) {
      setReceiverAddress(account.address);
    }
  }, [account.address]);

  async function sendTransaction() {
    const provider = new providers.Web3Provider(face.getEthLikeProvider(), 'any');

    const signer = await provider.getSigner();
    const transactionResponse = await signer.sendTransaction({
      to: receiverAddress,
      value: utils.parseUnits(amount),
    });

    setTxHash(transactionResponse.hash);

    console.group('[Transaction Information]');
    console.log('Transaction response:', transactionResponse);
    console.log('Explorer Link:', `${getExplorerUrl(network)}${transactionResponse.hash}`);

    const receipt = await transactionResponse.wait();
    console.log('Transaction receipt', receipt);
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
      <Field label="Amount">
        <input className="input" value={amount} onChange={(e) => setAmount(e.target.value)} />
      </Field>
      <Field label="Receiver Address">
        <input
          className="input"
          value={receiverAddress}
          onChange={(e) => setReceiverAddress(e.target.value)}
        />
      </Field>
      <Button onClick={sendTransaction}>Transfer 0.0001 coin</Button>
      {txHash && (
        <>
          <Message type="info">Hash: {txHash}</Message>
          <Message type="info">
            <a
              href={`${getExplorerUrl(network)}${txHash}`}
              rel="noopener noreferrer"
              target="_blank">
              Explorer Link
            </a>
          </Message>
        </>
      )}
    </Box>
  );
}

export default TransactionPlatformCoin;
