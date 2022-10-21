import { Face, Network } from '@haechi-labs/face-sdk';
import { useRecoilState } from 'recoil';

import { API_KEY } from '../config/apiKey';
import { faceAtom } from '../store';
import { networkAtom } from '../store/networkAtom';
import Box from './common/Box';
import Button from './common/Button';
import Message from './common/Message';

const networkList = [
  Network.ETHEREUM,
  Network.GOERLI,
  Network.POLYGON,
  Network.MUMBAI,
  Network.BNB_SMART_CHAIN,
  Network.BNB_SMART_CHAIN_TESTNET,
  Network.KLAYTN,
  Network.BAOBAB,
];

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
      {networkList.map((network) => (
        <Button key={network} onClick={() => connectTo(network)}>
          Connect to {network}
        </Button>
      ))}
    </Box>
  );
}

export default ConnectNetwork;
