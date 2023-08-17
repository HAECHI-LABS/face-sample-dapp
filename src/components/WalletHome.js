import { useRecoilValue } from 'recoil';

import { faceAtom } from '../store';
import { accountAtom } from '../store/accountAtom';
import Box from './common/Box';
import Button from './common/Button';
import Message from './common/Message';

const title = 'Wallet Home';
function WalletHome() {
  const face = useRecoilValue(faceAtom);
  const account = useRecoilValue(accountAtom);

  if (!face) {
    return (
      <Box title={title}>
        <Message type="danger">You must connect to the network first.</Message>
      </Box>
    );
  }
  if (!account.balance || !account.address) {
    return (
      <Box title={title}>
        <Message type="danger">You must log in and get account first.</Message>
      </Box>
    );
  }

  return (
    <Box title={title}>
      <Button onClick={() => face.wallet.home()}>Open wallet home for all networks</Button>
    </Box>
  );
}

export default WalletHome;
