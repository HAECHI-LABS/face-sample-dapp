import { Blockchain, isEthlikeBlockchain, LoginProvider, networkToBlockchain } from '@haechi-labs/face-types';
import { BigNumber, providers } from 'ethers';
import * as nearAPI from 'near-api-js';
import { useCallback, useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import { config as nearConfig } from '../config/near';
import { faceAtom } from '../store';
import { accountAtom } from '../store/accountAtom';
import CheckboxList from './CheckboxList';
import Box from './common/Box';
import Button from './common/Button';
import Message from './common/Message';

const title = 'Log in';
function LoginWithFace() {
  const face = useRecoilValue(faceAtom);
  const [, setAccount] = useRecoilState(accountAtom);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginProviders, setLoginProviders] = useState([]);

  const getAccountInfo = useCallback(async () => {
    const blockchain = networkToBlockchain(face.network);
    const user = await face.auth.getCurrentUser();
    let address, balance;

    if (blockchain === Blockchain.NEAR) {
      const nearProvider = face.near.getProvider();
      const publicKeys = await nearProvider.getPublicKeys();
      const near = await nearAPI.connect(nearConfig(face.network));
      address = Buffer.from(publicKeys[0].data).toString('hex');
      const account = await near.account(address);
      balance = await account
        .getAccountBalance()
        .then((bal) => {
          return BigNumber.from(bal.total);
        })
        .catch(() => {
          return BigNumber.from('0');
        });
    } else if (isEthlikeBlockchain(blockchain)) {
      const provider = new providers.Web3Provider(face.getEthLikeProvider(), 'any');

      const signer = await provider.getSigner();
      address = await signer.getAddress();
      balance = await signer.getBalance();
    } else {
      throw new Error('unknown blockchain ' + blockchain);
    }

    console.group('[Account Information]');
    console.log('Balance:', balance);
    console.log('Address:', address);
    console.log('Current user:', user);
    console.groupEnd();

    setAccount({ address, balance: balance.toString(), user });
  }, [face, setAccount]);

  async function login() {
    const res = await face.auth.login(loginProviders.length ? loginProviders : undefined);
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

  async function socialLogin(provider) {
    try {
      const res = await face.auth.directSocialLogin(provider);
      console.log('Social Login response:', res);
      setIsLoggedIn(true);
      getAccountInfo();
    } catch (e) {
      console.error('Social Login failed:', e);
    }
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
        <>
          <Message type="info">Log in succeed</Message>
          <Button onClick={getAccountInfo}>Get account information</Button>
          <Button onClick={logout}>Log out</Button>
        </>
      ) : (
        <>
          <CheckboxList
            items={Object.values(LoginProvider).map((p) => ({ key: p }))}
            state={loginProviders}
            setState={setLoginProviders}
          />
          <Button onClick={login}>Log in with Face wallet</Button>
          <Button onClick={() => socialLogin('google.com')}>Google login</Button>
          <Button onClick={() => socialLogin('apple.com')}>Apple login</Button>
          <Button onClick={() => socialLogin('facebook.com')}>Facebook login</Button>
          <Button onClick={() => socialLogin('twitter.com')}>Twitter login</Button>
          <Button onClick={() => socialLogin('kakao.com')}>Kakao login</Button>
          <Button onClick={() => socialLogin('discord.com')}>Discord login</Button>
        </>
      )}
    </Box>
  );
}

export default LoginWithFace;
