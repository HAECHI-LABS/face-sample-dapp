import { Face } from '@haechi-labs/face-sdk';
import { BoraPortalConnectStatusEnum, Network, FaceError } from '@haechi-labs/face-types';

const face = new Face({
  network: Network.BORA,
  apiKey: 'YOUR_DAPP_API_KEY',
});

const loginResponse = await face.auth.login();
try {
  const isConnectResponse = await face.bora.isConnected('wrong bapp usn');
  console.log(isConnectResponse);
} catch (err) {
  if (err.code === 4909) {
    console.log('the wallet is connected to other bapp usn');
  }
}
