import { getMetaMask, getWalletConnect, getWalletConnectLegacy, Kit } from '@haechi-labs/face-kit';
import {
  Blockchain,
  isEthlikeBlockchain,
  LoginProvider,
  networkToBlockchain,
} from '@haechi-labs/face-types';
import {klaytn, optimism} from "@wagmi/chains";
import {BigNumber, ethers, providers} from 'ethers';
import * as nearAPI from 'near-api-js';
import { useCallback, useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import { config as nearConfig } from '../config/near';
import { faceAtom } from '../store';
import { accountAtom } from '../store/accountAtom';
import {kitAtom} from "../store/kitAtom";
import {walletAtom} from "../store/walletAtom";
import CheckboxList from './CheckboxList';
import Box from './common/Box';
import Button from './common/Button';
import Hr from "./common/Hr";
import Message from './common/Message';

const title = 'Log in';
const wcProjectId = 'c4e1a0d62ff8a6c9211c5d4b12cc0d67';

function LoginWithFace() {
  const face = useRecoilValue(faceAtom);
  const [, setAccount] = useRecoilState(accountAtom);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginProviders, setLoginProviders] = useState([]);

  const [kit, setKit] = useRecoilState(kitAtom);
  const [kitOptions, setKitOptions] = useState([]);
  const [wallet, setWallet] = useRecoilState(walletAtom);
  const [externalWallets, setExternalWallets] = useState([]);

  const getAccountInfo = useCallback(async () => {
    const blockchain = networkToBlockchain(face.internal.network);
    const user = await face.auth.getCurrentUser();
    let address, balance;

    if (blockchain === Blockchain.NEAR) {
      const nearProvider = face.near.getProvider();
      const publicKeys = await nearProvider.getPublicKeys();
      const near = await nearAPI.connect(nearConfig(face.internal.network));
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
          <Hr />

          <h2 className="box__title title is-4">Face Wallet Kit</h2>
          {!kit && (
              <>
                <CheckboxList
                    items={[
                      { key: 'metaMask', label: 'MetaMask' },
                      { key: 'walletConnect', label: 'WalletConnect (v2)' },
                    ]}
                    state={externalWallets}
                    setState={setExternalWallets}
                />
                <CheckboxList
                    items={[
                      { key: 'expanded', label: 'Expand External Wallet' },
                      { key: 'emptyProviders', label: 'Empty Providers' },
                      { key: 'emptyExternalWallet', label: 'Empty External Wallet' },
                    ]}
                    state={kitOptions}
                    setState={setKitOptions}
                />
              </>
          )}
          {!kit && (
              <Button
                  onClick={async () => {
                    if (!face) {
                      return;
                    }
                    const kit = new Kit(face, {
                      providers: [
                        LoginProvider.Google,
                      ],
                      externalWalletOptions: {
                        wallets: [
                            getWalletConnect({
                                  options: { projectId: wcProjectId },
                                  chains: [
                                    klaytn,
                                    {
                                      id: 20197,
                                      name: "Sandverse",
                                      network: "Oasys Sandverse",

                                      rpcUrls: {
                                        default: { http: ["https://rpc.sandverse.oasys.games"]},
                                        public: { http: ["https://rpc.sandverse.oasys.games"]}
                                      },
                                    },
                                    {
                                      id: 99293,
                                      name: "roy",
                                      network: "RoyVerse",

                                      rpcUrls: {
                                        default: { http: ["https://rpc.sandverse.oasys.games"]},
                                        public: { http: ["https://rpc.sandverse.oasys.games"]}
                                      },
                                    },
                                    {
                                    id: 9372,
                                    name: "Testnet",
                                    network: "Oasys Testnet",
                                    nativeCurrency: "OAS",
                                    rpcUrls: {
                                      default: { "http": ["https://rpc.testnet.oasys.games"]},
                                      public: { "http": ["https://rpc.testnet.oasys.games"]}
                                        },
                                    }
                                  ]
                                })],
                        expanded: kitOptions.includes('expanded'),
                      },
                    });
                    setKit(kit);

                    try {
                      const isConnected = await kit.isConnected();
                      if (isConnected) {
                        const connectedWallet = await kit.connect();
                        console.log('Kit reconnected!', connectedWallet);
                        setWallet(connectedWallet);
                        setAccount({ address: await connectedWallet.connector.getAccount() });
                      }
                    } catch (e) {
                      console.error('Failed automatically connecting wallet by Kit:', e);
                    }
                  }}>
                Initialize Kit
              </Button>
          )}
          {kit && (
              <>
                <Button
                    onClick={async () => {
                      if (!kit) {
                        return;
                      }

                      try {
                        const connectedWallet = await kit.connect();
                        setWallet(connectedWallet);
                        setAccount({ address: await connectedWallet.connector.getAccount() });
                      } catch (e) {
                        console.error('Failed connecting wallet by Kit:', e);
                      }
                    }}>
                  Connect wallet by Kit
                </Button>
                <Button
                    onClick={async () => {
                      console.log('isConnected', await kit.isConnected());
                    }}>
                  isConnected
                </Button>
                <Button
                    onClick={async () => {
                      console.log('ConnectedWallet', kit.getConnectedWallet());
                    }}>
                  Get ConnectedWallet
                </Button>
                <Button
                    onClick={() => {
                      kit.disconnect();
                      setWallet(null);
                      setAccount({});
                    }}>
                  disconnect wallet
                </Button>
                <Button
                    onClick={async ()=>{
                      const faceChainId = await kit.face.getChainId()
                      console.log("faceChainId", faceChainId)
                      const connectedWallet = await kit.connect();
                      console.log('Kit connect response:', connectedWallet);  // <- Connected wallet has chainId = 20197

                      const baseProvider = await connectedWallet.connector.getProvider()
                      console.log("baseProvider", baseProvider)               // <- The base provider has chainId = 1
                      const provider = new providers.Web3Provider(
                          baseProvider
                      );
                      console.log("provider", provider)                       // <- Cannot force the chainId

                      const signer = provider.getSigner();
                      const blk = await provider.getBlock("latest")
                      console.log(blk)

                    }}>Test Kit Result ( show in console )
                </Button>
              </>
          )}
        </>
      )}
    </Box>
  );
}

export default LoginWithFace;
