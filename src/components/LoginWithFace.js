import { useState, useEffect } from 'react';
import { providers, utils } from 'ethers';
import { useRecoilState, useRecoilValue } from 'recoil';

import Box from './Box';
import { faceAtom } from '../store';
import { accountAtom } from '../store/accountAtom';

const title = 'Login';
function LoginWithFace() {
  const face = useRecoilValue(faceAtom);
  const [account, setAccount] = useRecoilState(accountAtom);
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
        <div className="alert danger">You must connect to the network first.</div>
      </Box>
    );
  }

  return (
    <Box title={title}>
      {isLoggedIn ? (
        <div className="alert info">Log-in succeed</div>
      ) : (
        <button onClick={() => login().then(() => setIsLoggedIn(true))}>
          Login with Face wallet
        </button>
      )}
      {isLoggedIn && (
        <button onClick={() => getAccountInfo().then(setAccount)}>Get account information</button>
      )}

      {account.address && <div className="alert info">Address: {account.address}</div>}
      {account.balance && (
        <div className="alert info">Balance: {utils.formatEther(account.balance)}</div>
      )}
    </Box>
  );
}

export default LoginWithFace;
