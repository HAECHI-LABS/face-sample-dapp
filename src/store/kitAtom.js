import { atom } from 'recoil';

export const kitAtom = atom({
  key: 'kitAtom',
  default: null,
  dangerouslyAllowMutability: true,
});
