import { providers } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import { faceAtom } from '../store';
import { accountAtom } from '../store/accountAtom';
import Box from './common/Box';
import Button from './common/Button';
import Message from './common/Message';

const title = 'Log in';
function LoginWithFace() {
  const face = useRecoilValue(faceAtom);
  const [, setAccount] = useRecoilState(accountAtom);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const getAccountInfo = useCallback(async () => {
    const provider = new providers.Web3Provider(face.getEthLikeProvider(), 'any');

    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    const balance = await signer.getBalance();
    const user = await face.auth.getCurrentUser();

    console.group('[Account Information]');
    console.log('Balance:', balance);
    console.log('Address:', address);
    console.log('Current user:', user);
    console.groupEnd();

    setAccount({ address, balance: balance.toString(), user });
  }, [face, setAccount]);

  async function login() {
    const res = await face.auth.login();
    console.log('Login response:', res);
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
        <Button onClick={login}>Log in with Face wallet</Button>
      )}
    </Box>
  );
}

export default LoginWithFace;
