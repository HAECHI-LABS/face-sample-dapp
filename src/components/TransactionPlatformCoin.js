import { Blockchain, isEthlikeBlockchain, networkToBlockchain } from '@haechi-labs/face-types';
import { ethers, providers, utils } from 'ethers';
import { poll } from 'ethers/lib/utils';
import * as nearAPI from 'near-api-js';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { config as nearConfig } from '../config/near';
import { createPlatformCoin } from '../lib/types';
import { getExplorerUrl, getProvider } from '../lib/utils';
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
    let sentTx;
    const blockchain = networkToBlockchain(network);
    const coinAmount = createPlatformCoin(amount, blockchain);
    if (isEthlikeBlockchain(blockchain)) {
      const provider = new providers.Web3Provider(face.getEthLikeProvider(), 'any');
      const signer = await provider.getSigner();
      const transactionResponse = await signer.sendTransaction({
        to: receiverAddress,
        value: coinAmount.toHexAmount(),
      });
      sentTx = {
        hash: transactionResponse.hash,
        wait: async () => {
          const receipt = await transactionResponse.wait();
          return {
            status: receipt.status === 1,
            internal: receipt,
          };
        },
      };
    } else if (blockchain === Blockchain.NEAR) {
      const nearProvider = face.near.getProvider();
      const publicKey = (await nearProvider.getPublicKeys())[0];
      const senderAddress = ethers.utils.hexlify(publicKey.data);
      const provider = new nearAPI.providers.JsonRpcProvider({ url: getProvider(network) });
      const accessKey = await provider
        .query(`access_key/${senderAddress}/${publicKey.toString()}`, '')
        .catch(() => ({ nonce: 0 }));
      const nonce = accessKey.nonce + 1;
      const actions = [nearAPI.transactions.transfer(coinAmount.toDecimalAmountAsString())];

      const near = await nearAPI.connect(nearConfig(network));

      const status = await near.connection.provider.status();

      const blockHash = status.sync_info.latest_block_hash;
      const serializedBlockHash = nearAPI.utils.serialize.base_decode(blockHash);
      const tx = nearAPI.transactions.createTransaction(
        senderAddress,
        publicKey,
        receiverAddress,
        nonce,
        actions,
        serializedBlockHash
      );
      const result = await nearProvider.signAndSendTransaction(tx);
      sentTx = {
        hash: result,
        wait: async () => {
          return await poll(async () => {
            try {
              const receipt = await provider.txStatus(result, senderAddress);
              return {
                status: Object.keys(receipt.status).includes('SuccessValue'),
                internal: receipt,
              };
            } catch (e) {
              console.debug('polling error', e);
              return undefined;
            }
          });
        },
      };
    } else {
      throw new Error('unknown blockchain ' + blockchain);
    }

    setTxHash(sentTx.hash);

    console.group('[Transaction Information]');
    console.log('Transaction response:', sentTx);
    console.log('Explorer Link:', `${getExplorerUrl(network)}${sentTx.hash}`);

    const receipt = await sentTx.wait();
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
