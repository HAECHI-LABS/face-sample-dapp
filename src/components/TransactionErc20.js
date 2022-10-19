import { Network } from '@haechi-labs/face-sdk';
import { ethers, providers, utils } from 'ethers';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { ERC20_ABI } from '../lib/abi';
import { getExplorerUrl, makeErc20Data } from '../lib/utils';
import { faceAtom } from '../store';
import { accountAtom } from '../store/accountAtom';
import { networkAtom } from '../store/networkAtom';
import Box from './common/Box';
import Button from './common/Button';
import Field from './common/Field';
import Message from './common/Message';

const erc20ContractAddressMap = {
  [Network.ETH_MAINNET]: '0x8A904F0Fb443D62B6A2835483b087aBECF93a137',
  [Network.ETH_TESTNET]: '0x6558820324875d2747a32B7D37496fd473AD7648',
  [Network.MATIC_MAINNET]: '0xfce04dd232006d0da001f6d54bb5a7fc969dbc08',
  [Network.MATIC_TESTNET]: '0xfce04dd232006d0da001f6d54bb5a7fc969dbc08',
  [Network.BINANCE_COIN_MAINNET]: '0xab3e0c68e867f1c81a6660960fdfcf53402b33bf',
  [Network.BINANCE_COIN_TESTNET]: '0x4c253d0f5de4dac61c5355aaa3efe0872dfadfff',
  [Network.KLAYTN_MAINNET]: '0xab3e0c68e867f1c81a6660960fdfcf53402b33bf',
  [Network.KLAYTN_TESTNET]: '0xb5567463c35dE682072A669425d6776B178Be3E4',
  [Network.BORA]: '0x797115bcdbD85DC865222724eD67d473CE168962',
  [Network.BORA_TESTNET]: '0x3d5cb6Be01f218CCA1Ec077028F2CFDC943A36f6',
};

const title = 'Fungible Token Transaction';
function TransactionErc20() {
  const face = useRecoilValue(faceAtom);
  const account = useRecoilValue(accountAtom);
  const network = useRecoilValue(networkAtom);
  const [txHash, setTxHash] = useState('');
  const [amount, setAmount] = useState('0.001');
  const [contractAddress, setContractAddress] = useState('');
  const [receiverAddress, setReceiverAddress] = useState('');
  const [balance, setBalance] = useState('');

  useEffect(() => {
    // Set receiver to user account
    if (account.address) {
      setReceiverAddress(account.address);
    }
  }, [account.address]);

  useEffect(() => {
    // Set default contract address
    if (network) {
      setContractAddress(erc20ContractAddressMap[network]);
    }
  }, [network]);

  async function sendTransaction() {
    if (!amount) {
      alert('Please enter amount');
      return;
    }
    if (!contractAddress) {
      alert('Please enter contract address');
      return;
    }
    if (!receiverAddress) {
      alert('Please enter receiver address');
      return;
    }

    const provider = new providers.Web3Provider(face.getEthLikeProvider(), 'any');

    const signer = await provider.getSigner();
    const transactionResponse = await signer.sendTransaction({
      to: contractAddress,
      value: '0x0',
      data: makeErc20Data('transfer', receiverAddress, utils.parseUnits(amount)),
    });

    setTxHash(transactionResponse.hash);

    console.group('[Transaction Information]');
    console.log('Transaction response:', transactionResponse);
    console.log('Explorer Link:', `${getExplorerUrl(network)}${transactionResponse.hash}`);

    const receipt = await transactionResponse.wait();
    console.log('Transaction receipt', receipt);
    console.groupEnd();
  }

  async function getBalance() {
    if (!contractAddress) {
      alert('Please enter contract address');
      return;
    }

    const provider = new providers.Web3Provider(face.getEthLikeProvider(), 'any');
    const contract = new ethers.Contract(contractAddress, ERC20_ABI, provider);
    const balance = await contract.balanceOf(account.address);

    setBalance(utils.formatUnits(balance));
  }

  if (!face) {
    return (
      <Box title={title}>
        <Message type="danger">You must connect to the network first.</Message>
      </Box>
    );
  }
  if (!account.address) {
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
      <Field label="Contract Address">
        <input
          className="input"
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
        />
      </Field>
      <Field label="Receiver Address">
        <input
          className="input"
          value={receiverAddress}
          onChange={(e) => setReceiverAddress(e.target.value)}
        />
      </Field>
      <Button onClick={sendTransaction}>Transfer {amount} ERC20 token</Button>
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
      <Button onClick={getBalance}>Get ERC20 token balance</Button>
      {balance && (
        <Message type="info" className="has-text-left">
          Balance: {balance}
        </Message>
      )}
    </Box>
  );
}

export default TransactionErc20;
