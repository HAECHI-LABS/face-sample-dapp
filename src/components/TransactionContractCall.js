import { Network } from '@haechi-labs/face-sdk';
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

const contractAddressMap = {
  [Network.ETH_MAINNET]: '',
  [Network.ETH_TESTNET]: '0xAE5c1CF9C362CFD6B5F94e00Eacb8D406429B35a',
  [Network.MATIC_MAINNET]: '',
  [Network.MATIC_TESTNET]: '0xe63c2f4bdd0df2b18b0a4e0210d4b1e95a23dff9',
  [Network.BINANCE_COIN_MAINNET]: '',
  [Network.BINANCE_COIN_TESTNET]: '0x33d24CdD4a858BC2965568717C7D11eC38650c56',
  [Network.KLAYTN_MAINNET]: '',
  [Network.KLAYTN_TESTNET]: '0xfe72540387e1F9aeFAC07D230dAE1865ad2E733c',
  [Network.BORA]: '0x5f07F73c6b3B0F02AB5821e7c1a2E3BcF6A78Bc6',
  [Network.BORA_TESTNET]: '0x10791D8c364DC71928e4F1484a5a7344568d6365',
};

const title = 'Contract Call Transaction';
function TransactionContractCall() {
  const face = useRecoilValue(faceAtom);
  const account = useRecoilValue(accountAtom);
  const network = useRecoilValue(networkAtom);
  const [txHash, setTxHash] = useState('');
  const [contractAddress, setContractAddress] = useState('');
  const [amount, setAmount] = useState('0');
  const [txData, setTxData] = useState('');

  useEffect(() => {
    // Set default contract address
    if (network) {
      setContractAddress(contractAddressMap[network]);
    }
  }, [network]);

  async function sendTransaction() {
    if (!contractAddress) {
      alert('Please enter contract address');
      return;
    }

    const provider = new providers.Web3Provider(face.getEthLikeProvider(), 'any');

    const signer = await provider.getSigner();
    const transactionResponse = await signer.sendTransaction({
      to: contractAddress,
      value: utils.parseUnits(amount),
      data: txData,
    });

    setTxHash(transactionResponse.hash);

    console.group('[Transaction Information]');
    console.log('Transaction response:', transactionResponse);
    console.log('Ropsten Link:', `${getExplorerUrl(network)}${transactionResponse.hash}`);

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
      <Field label="Contract Address">
        <input
          className="input"
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
        />
      </Field>
      <Field label="Amount">
        <input className="input" value={amount} onChange={(e) => setAmount(e.target.value)} />
      </Field>
      <Field label="Tx Data">
        <input className="input" value={txData} onChange={(e) => setTxData(e.target.value)} />
      </Field>
      <Button onClick={sendTransaction}>Call contract</Button>
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
      <Message type="dark" className="has-text-left">
        <h4 className="has-text-weight-bold">Sample data for sample contract</h4>
        <div>
          For success: <span className="tag is-success is-light">0x0b93381b</span>
        </div>
        <div>
          For failure: <span className="tag is-danger is-light">0xa9cc4718</span>
        </div>
      </Message>
    </Box>
  );
}

export default TransactionContractCall;
