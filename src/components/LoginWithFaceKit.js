import { providers } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import { faceAtom, faceKitAtom, providerAtom } from '../store';
import { accountAtom } from '../store/accountAtom';
import Box from './common/Box';
import Button from './common/Button';
import Message from './common/Message';

const { Kit, getMetaMask, getWalletConnect, getWalletConnectLegacy } = window.FaceKit;
const { LoginProvider } = window.FaceTypes;

const title = 'Log in with kit';
function LoginWithFaceKit() {
  const face = useRecoilValue(faceAtom);
  const [faceKit, setFaceKit] = useRecoilState(faceKitAtom);
  const [, setAccount] = useRecoilState(accountAtom);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [provider, setProvider] = useRecoilState(providerAtom);

  useEffect(() => {
    if (face == null) {
      return;
    }
    if (!faceKit) {
      const kit = new Kit(face, {
        providers: [LoginProvider.Apple, LoginProvider.Google, LoginProvider.Discord],
        externalWalletOptions: {
          wallets: [
            getMetaMask(),
            getWalletConnect({ options: { projectId: 'c4e1a0d62ff8a6c9211c5d4b12cc0d67' } }),
            getWalletConnectLegacy(),
          ],
          expanded: false,
        },
      });
      setFaceKit(kit);
    }
  }, [face, faceKit, setFaceKit]);

  const getAccountInfo = useCallback(async () => {
    if (provider == null) {
      return;
    }
    const ethersProvider = new providers.Web3Provider(provider, 'any');

    const signer = await ethersProvider.getSigner();
    const address = await signer.getAddress();
    const balance = await signer.getBalance();
    const user = await face.auth.getCurrentUser();

    console.group('[Account Information]');
    console.log('Balance:', balance);
    console.log('Address:', address);
    console.log('Current user:', user);
    console.groupEnd();

    setAccount({ address, balance: balance.toString(), user });
  }, [face, setAccount, provider]);

  useEffect(() => {
    if (provider == null) {
      return;
    }
    getAccountInfo();
  }, [provider, getAccountInfo]);

  async function login() {
    if (!faceKit) {
      return;
    }
    const connectResult = await faceKit.connect();
    console.log('Connect result:', connectResult);
    setProvider(await connectResult.connector.getProvider());

    // const res = await face.auth.login();
    // console.log('Login response:', res);
    setIsLoggedIn(true);
    getAccountInfo();
  }

  async function logout() {
    await face.auth.logout();
    setIsLoggedIn(false);
    setAccount({});
  }

  useEffect(() => {
    if (!face) {
      return;
    }

    face.auth.isLoggedIn().then((result) => {
      setIsLoggedIn(result);

      if (result) {
        getAccountInfo();
      }
    });
  }, [face, getAccountInfo]);

  if (!face) {
    return (
      <Box title={title}>
        <Message type="danger">You must connect to the network first.</Message>
      </Box>
    );
  }

  return (
    <Box title={title}>
      {isLoggedIn ? (
        <>
          <Message type="info">Log in succeed</Message>
          <Button onClick={getAccountInfo}>Get account information</Button>
          <Button onClick={logout}>Log out</Button>
        </>
      ) : (
        <Button onClick={login}>Log in with Face wallet kit</Button>
      )}
    </Box>
  );
}

export default LoginWithFaceKit;
