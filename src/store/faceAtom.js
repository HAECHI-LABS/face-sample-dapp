import { atom } from 'recoil';

export const faceAtom = atom({
  key: 'faceAtom',
  default: null,
  dangerouslyAllowMutability: true,
});
