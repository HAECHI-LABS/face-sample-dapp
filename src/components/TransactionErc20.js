import { Network } from '@haechi-labs/face-sdk';
import { networkToBlockchain } from '@haechi-labs/face-types';
import BN from 'bn.js';
import { ethers, providers, utils } from 'ethers';
import { poll } from 'ethers/lib/utils';
import * as nearAPI from 'near-api-js';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { config as nearConfig } from '../config/near';
import { ERC20_ABI } from '../lib/abi';
import { createLargeDecimalFT } from '../lib/types';
import { calcNearTgas, getExplorerUrl, getProvider, makeErc20Data } from '../lib/utils';
import { faceAtom } from '../store';
import { accountAtom } from '../store/accountAtom';
import { networkAtom } from '../store/networkAtom';
import Box from './common/Box';
import Button from './common/Button';
import Field from './common/Field';
import Message from './common/Message';

const erc20ContractAddressMap = {
  [Network.ETHEREUM]: '0x8A904F0Fb443D62B6A2835483b087aBECF93a137',
  [Network.GOERLI]: '0xB112d79fc314E1F6901984F0b4fA7680057BFB63',
  [Network.POLYGON]: '0xfce04dd232006d0da001f6d54bb5a7fc969dbc08',
  [Network.MUMBAI]: '0xfce04dd232006d0da001f6d54bb5a7fc969dbc08',
  [Network.BNB_SMART_CHAIN]: '0xab3e0c68e867f1c81a6660960fdfcf53402b33bf',
  [Network.BNB_SMART_CHAIN_TESTNET]: '0x4c253d0f5de4dac61c5355aaa3efe0872dfadfff',
  [Network.KLAYTN]: '0xab3e0c68e867f1c81a6660960fdfcf53402b33bf',
  [Network.BAOBAB]: '0xb5567463c35dE682072A669425d6776B178Be3E4',
  [Network.BORA]: '0x797115bcdbD85DC865222724eD67d473CE168962',
  [Network.BORA_TESTNET]: '0x3d5cb6Be01f218CCA1Ec077028F2CFDC943A36f6',
  [Network.NEAR]: 'TODO',
  [Network.NEAR_TESTNET]: 'facewallet.testnet',
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

    if (network === Network.NEAR || network === Network.NEAR_TESTNET) {
      const nearProvider = face.near.getProvider();
      const publicKey = (await nearProvider.getPublicKeys())[0];

      const senderAddress = ethers.utils.hexlify(publicKey.data).slice(2);

      const provider = new nearAPI.providers.JsonRpcProvider({ url: getProvider(network) });
      const accessKey = await provider
        .query(`access_key/${senderAddress}/${publicKey.toString()}`, '')
        .catch(() => ({ nonce: 0 }));

      const nonce = accessKey.nonce + 1;
      const actions = [
        nearAPI.transactions.functionCall(
          'ft_transfer',
          {
            receiver_id: receiverAddress,
            amount: createLargeDecimalFT(
              amount,
              networkToBlockchain(network)
            ).toDecimalAmountAsString(),
          },
          calcNearTgas(6),
          new BN('1', 10)
        ),
      ];
      const near = await nearAPI.connect(nearConfig(network));

      const status = await near.connection.provider.status();

      const blockHash = status.sync_info.latest_block_hash;
      const serializedBlockHash = nearAPI.utils.serialize.base_decode(blockHash);

      const tx = nearAPI.transactions.createTransaction(
        senderAddress,
        publicKey,
        contractAddress,
        nonce,
        actions,
        serializedBlockHash
      );
      const result = await nearProvider.signAndSendTransaction(tx);

      setTxHash(result);

      const sentTx = {
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
              return undefined;
            }
          });
        },
      };

      console.group('[Transaction Information]');
      console.log('Transaction response:', sentTx);
      console.log('Explorer Link:', `${getExplorerUrl(network, sentTx.hash)}`);

      const receipt = await sentTx.wait();
      console.log('Transaction receipt', receipt);
      console.groupEnd();
    } else {
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
  }

  async function getBalance() {
    if (!contractAddress) {
      alert('Please enter contract address');
      return;
    }

    if (network === Network.NEAR || network === Network.NEAR_TESTNET) {
      const provider = face.near.getProvider();
      const balance = await provider.getBalance(account.address, contractAddress);
      setBalance(utils.formatUnits(balance));
    } else {
      const provider = new providers.Web3Provider(face.getEthLikeProvider(), 'any');
      const contract = new ethers.Contract(contractAddress, ERC20_ABI, provider);
      const balance = await contract.balanceOf(account.address);
      setBalance(utils.formatUnits(balance));
    }
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
