import { atom } from 'recoil';

import { PRV_KEY } from '../config/prvKey';

export const privateKeyAtom = atom({
  key: 'privateKeyAtom',
  default: PRV_KEY,
});
