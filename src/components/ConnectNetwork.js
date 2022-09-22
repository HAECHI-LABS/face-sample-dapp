import { useRecoilState } from 'recoil';
import { Face, Network } from '@haechi-labs/face-sdk';

import Box from './Box';
import { faceAtom } from '../store';
import { API_KEY } from '../config/apiKey';
import { networkAtom } from '../store/networkAtom';

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

  return (
    <Box title="Connect Network">
      {face ? (
        <div className="alert info">Connected</div>
      ) : (
        <>
          <button onClick={() => connectTo(Network.ETH_TESTNET)}>Connect to Ether Testnet</button>
          <button onClick={() => connectTo(Network.ETH_MAINNET)}>Connect to Ether Mainnet</button>
          <button onClick={() => connectTo(Network.MATIC_TESTNET)}>
            Connect to Polygon Testnet
          </button>
          <button onClick={() => connectTo(Network.MATIC_MAINNET)}>
            Connect to Polygon Mainnet
          </button>
        </>
      )}
    </Box>
  );
}

export default ConnectNetwork;
