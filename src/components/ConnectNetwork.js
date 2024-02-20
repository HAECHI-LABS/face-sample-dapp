import { Face, Network } from '@haechi-labs/face-sdk';
import { Env } from '@haechi-labs/face-types';
import { useRecoilState } from 'recoil';

import { resolveApiKey } from '../config/apiKey';
import { faceAtom } from '../store';
import { networkAtom } from '../store/networkAtom';
import Box from './common/Box';
import Button from './common/Button';
import Message from './common/Message';

const networkList = [
  Network.ETHEREUM,
  Network.SEPOLIA,
  Network.POLYGON,
  Network.MUMBAI,
  Network.BNB_SMART_CHAIN,
  Network.BNB_SMART_CHAIN_TESTNET,
  Network.KLAYTN,
  Network.BAOBAB,
  Network.BORA,
  Network.BORA_TESTNET,
  Network.NEAR,
  Network.NEAR_TESTNET,
  Network.SAND_VERSE,
  Network.OASYS_TESTNET
];

const title = 'Connect Network';

function ConnectNetwork() {
  const [face, setFace] = useRecoilState(faceAtom);
  const [, setNetwork] = useRecoilState(networkAtom);

  const connectTo = (network) => {
    setNetwork(network);

    console.log(network);
    const face = new Face({
      apiKey: resolveApiKey(network),
      network: network,
      notificationOptions: {
        type: 'toast',
      },
      env: Env.ProdTest,
    });
    console.log(face.internal);
    setFace(face);
  };

  if (face) {
    return (
      <Box title={title}>
        <Message type="info">Connected</Message>
      </Box>
    );
  }

  const resolveNetworkName = (network) => {
    switch (network) {
      case Network.ETHEREUM:
        return 'Ethereum';
      case Network.SEPOLIA:
        return 'Sepolia';
      case Network.POLYGON:
        return 'Polygon';
      case Network.MUMBAI:
        return 'Mumbai';
      case Network.BNB_SMART_CHAIN:
        return 'BNB Smart Chain';
      case Network.BNB_SMART_CHAIN_TESTNET:
        return 'BNB Smart Chain Testnet';
      case Network.KLAYTN:
        return 'Klaytn';
      case Network.BAOBAB:
        return 'Baobab';
      case Network.BORA:
        return 'Bora';
      case Network.BORA_TESTNET:
        return 'Bora Testnet';
      case Network.NEAR:
        return 'NEAR';
      case Network.NEAR_TESTNET:
        return 'NEAR Testnet';
      case Network.SAND_VERSE:
        return 'Sand Verse'
      case Network.OASYS_TESTNET:
        return 'Oasys Testnet'
      default:
        throw new Error('unsupported network error');
    }
  };

  return (
    <Box title={title}>
      {networkList.map((network) => (
        <Button key={network} onClick={() => connectTo(network)}>
          Connect to {resolveNetworkName(network)}
        </Button>
      ))}
    </Box>
  );
}

export default ConnectNetwork;
