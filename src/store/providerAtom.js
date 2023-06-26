import { atom } from 'recoil';

export const providerAtom = atom({
  key: 'providerAtom',
  default: null,
  dangerouslyAllowMutability: true,
});
