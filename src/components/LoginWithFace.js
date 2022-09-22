import { providers } from 'ethers';
import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import { faceAtom } from '../store';
import { accountAtom } from '../store/accountAtom';
import Box from './common/Box';
import Message from './common/Message';

const title = 'Log in';
function LoginWithFace() {
  const face = useRecoilValue(faceAtom);
  const [, setAccount] = useRecoilState(accountAtom);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (!face) {
      return;
    }

    face.auth.isLoggedIn().then((result) => setIsLoggedIn(result));
  }, [face]);

  async function login() {
    const res = await face.auth.login();
    console.log('Login response:', res);

    return res;
  }

  async function logout() {
    await face.auth.logout();
    setIsLoggedIn(false);
    setAccount({});
  }

  async function getAccountInfo() {
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

    return { address, balance: balance.toString(), user };
  }

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
        <Message type="info">Log in succeed</Message>
      ) : (
        <button className="button" onClick={() => login().then(() => setIsLoggedIn(true))}>
          Log in with Face wallet
        </button>
      )}
      {isLoggedIn && (
        <>
          <button className="button" onClick={() => getAccountInfo().then(setAccount)}>
            Get account information
          </button>
          <button className="button" onClick={() => logout()}>
            Log out
          </button>
        </>
      )}
    </Box>
  );
}

export default LoginWithFace;
