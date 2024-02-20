import { atom } from 'recoil';

// Kit에서 사용되는 객체(Wallet)
// Kit을 통해 로그인하면 Wallet 객체를 리턴하고, 해당 객체에서 Provider를 받아 쓸 수 있음
// transaction을 전송하거나 sign할 때, walletStore에 Wallet 객체가 있으면 Wallet에서 provider를 받아서 사용함.
export const walletAtom = atom({
  key: 'walletAtom',
  default: null,
  dangerouslyAllowMutability: true,
});
