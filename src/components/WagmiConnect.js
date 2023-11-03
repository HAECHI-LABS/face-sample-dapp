import { Face, Network } from '@haechi-labs/face-sdk';
import { Kit, getMetaMask, getWalletConnect } from '@haechi-labs/face-kit';
import { LoginProvider } from '@haechi-labs/face-types';

import { resolveApiKey } from '../config/apiKey';
import { faceAtom } from '../store';
import { networkAtom } from '../store/networkAtom';
import Box from './common/Box';
import Button from './common/Button';

function WagmiConnect() {
  const [face, setFace] = useRecoilState(faceAtom);
  const [, setNetwork] = useRecoilState(networkAtom);

  const { address, isConnected } = useAccount()
  const { data: ensName } = useEnsName({ address })
//   const { connect } = useConnect({

  const connectTo = async (network) => {
    setNetwork(network);

    console.log(network);
    const face = new Face({
      apiKey: resolveApiKey(network),
      network: network,
    });
    setFace(face);

    const kit = new Kit(face, {
      providers: [
        /* You can set social providers you want use */
        LoginProvider.Google,
        LoginProvider.Apple,
        LoginProvider.Discord,
      ],
      externalWalletOptions: {
        wallets: [getMetaMask(), getWalletConnect({ options: { projectId: wcProjectId } })],
        expanded: false,
      },
    });

    const connectedWallet = await kit.connect();
    connector: new InjectedConnector(),
  })
  };

  /*

    */
  return (
    <Box title={title}>
      <Button onClick={() => connectTo(Network.GOERLI)}>Ethereum</Button>
    </Box>
  );
}

export default WagmiConnect;
