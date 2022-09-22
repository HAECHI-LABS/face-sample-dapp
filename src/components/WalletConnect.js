import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { faceAtom } from '../store';
import Box from './common/Box';
import Message from './common/Message';

const title = 'Wallet Connect';
function WalletConnect() {
  const face = useRecoilValue(faceAtom);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (face) {
      face.auth.isLoggedIn().then((re) => setIsLoggedIn(re));
    }
  }, [face]);

  if (!face) {
    return (
      <Box title={title}>
        <Message type="danger">You must connect to the network first.</Message>
      </Box>
    );
  }
  if (!isLoggedIn) {
    return (
      <Box title={title}>
        <Message type="danger">You must log in first.</Message>
      </Box>
    );
  }

  return (
    <Box title={title}>
      <button className="button" onClick={() => face.wc.connectOpensea()}>
        Connect Opensea with Wallet Connect
      </button>
    </Box>
  );
}

export default WalletConnect;
