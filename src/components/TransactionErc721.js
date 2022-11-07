import { Network } from '@haechi-labs/face-sdk';
import { BigNumber, providers } from 'ethers';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { getExplorerUrl, makeErc721Data } from '../lib/utils';
import { faceAtom } from '../store';
import { accountAtom } from '../store/accountAtom';
import { networkAtom } from '../store/networkAtom';
import Box from './common/Box';
import Button from './common/Button';
import Field from './common/Field';
import Message from './common/Message';

const erc721ContractAddressMap = {
  [Network.ETH_MAINNET]: '',
  [Network.ETH_TESTNET]: '0x4Caf688bcb35302861c5e87B0b94C190e2b346D7',
  [Network.MATIC_MAINNET]: '',
  [Network.MATIC_TESTNET]: '0x1CB4d2F2055299ca23BC310260ABaf72C5ACe800',
  [Network.BINANCE_COIN_MAINNET]: '0xb3484b204c96b366e1004e94bc50fe637322da47',
  [Network.BINANCE_COIN_TESTNET]: '0x2d65997da649f79ff79ac49501d786cc4973a715',
  [Network.KLAYTN_MAINNET]: '0xa2fab648f2cfd5cea88492808214fce0cca15b5e',
  [Network.KLAYTN_TESTNET]: '0x7059f425113f6630bd3871d778f0c289939a0da8',
  [Network.BORA]: '0x646ea0705805AE57C3500d6EC46BF982Fa88ed83',
  [Network.BORA_TESTNET]: '0x0F2585C209Fc272ad29b9c945766A0F7C45db7a0',
};

const title = 'Non-Fungible Token Transaction';
function TransactionErc721() {
  const face = useRecoilValue(faceAtom);
  const account = useRecoilValue(accountAtom);
  const network = useRecoilValue(networkAtom);
  const [txHash, setTxHash] = useState('');
  const [tokenId, setTokenId] = useState('');
  const [contractAddress, setContractAddress] = useState('');
  const [receiverAddress, setReceiverAddress] = useState('');

  useEffect(() => {
    // Set receiver to user account
    if (account.address) {
      setReceiverAddress(account.address);
    }
  }, [account.address]);

  useEffect(() => {
    // Set default contract address
    if (network) {
      setContractAddress(erc721ContractAddressMap[network]);
    }
  }, [network]);

  async function sendTransaction() {
    if (!tokenId) {
      alert('Please enter token ID');
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
    const myAddress = await signer.getAddress();
    const transactionResponse = await signer.sendTransaction({
      to: contractAddress,
      value: '0x0',
      data: makeErc721Data('transferFrom', myAddress, receiverAddress, BigNumber.from(tokenId)),
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
      <Field label="Token ID">
        <input className="input" value={tokenId} onChange={(e) => setTokenId(e.target.value)} />
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
      <Button onClick={sendTransaction}>Transfer ERC721 token</Button>
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

export default TransactionErc721;
