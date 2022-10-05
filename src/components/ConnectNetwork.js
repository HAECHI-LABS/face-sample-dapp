import { Face, Network } from '@haechi-labs/face-sdk';
import { useRecoilState } from 'recoil';

import { API_KEY } from '../config/apiKey';
import { faceAtom } from '../store';
import { networkAtom } from '../store/networkAtom';
import Box from './common/Box';
import Button from './common/Button';
import Message from './common/Message';

const title = 'Connect Network';
function ConnectNetwork() {
  const [face, setFace] = useRecoilState(faceAtom);
  const [, setNetwork] = useRecoilState(networkAtom);

  const connectTo = (network) => {
    setNetwork(network);

    const face = new Face({
      apiKey: API_KEY,
      network: network,
    });
    setFace(face);
  };

  if (face) {
    return (
      <Box title={title}>
        <Message type="info">Connected</Message>
      </Box>
    );
  }

  return (
    <Box title={title}>
      <Button onClick={() => connectTo(Network.ETH_TESTNET)}>Connect to Ether Testnet</Button>
      <Button onClick={() => connectTo(Network.ETH_MAINNET)}>Connect to Ether Mainnet</Button>
      <Button onClick={() => connectTo(Network.MATIC_TESTNET)}>Connect to Polygon Testnet</Button>
      <Button onClick={() => connectTo(Network.MATIC_MAINNET)}>Connect to Polygon Mainnet</Button>
      <Button onClick={() => connectTo(Network.BINANCE_COIN_TESTNET)}>
        Connect to BNB Smart Chain Testnet
      </Button>
      <Button onClick={() => connectTo(Network.BINANCE_COIN_MAINNET)}>
        Connect to BNB Smart Chain Mainnet
      </Button>
      <Button onClick={() => connectTo(Network.KLAYTN_TESTNET)}>Connect to Klaytn Testnet</Button>
      <Button onClick={() => connectTo(Network.KLAYTN_MAINNET)}>Connect to Klaytn Mainnet</Button>
    </Box>
  );
}

export default ConnectNetwork;
