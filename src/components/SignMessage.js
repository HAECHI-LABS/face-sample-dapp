import { providers } from 'ethers';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';

import { faceAtom, providerAtom } from '../store';
import { accountAtom } from '../store/accountAtom';
import Box from './common/Box';
import Button from './common/Button';
import Field from './common/Field';
import Message from './common/Message';

const title = 'Sign Message';
function SignMessage() {
  const face = useRecoilValue(faceAtom);
  const account = useRecoilValue(accountAtom);
  const [message, setMessage] = useState('');
  const [signedMessage, setSignedMessage] = useState('');
  const provider = useRecoilValue(providerAtom);

  async function signMessage() {
    const ethersProvider = new providers.Web3Provider(provider, 'any');

    const signer = await ethersProvider.getSigner();
    const response = await signer.signMessage(message);

    console.log('Signed message', response);
    setSignedMessage(response);
  }

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
      <Field label="Message">
        <textarea
          className="textarea"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </Field>
      <Button onClick={() => signMessage()}>Sign Message</Button>

      {signedMessage && (
        <Message type="info" className="has-text-left">
          <h4 className="has-text-weight-bold">Signed message</h4>
          <div>{signedMessage}</div>
        </Message>
      )}
    </Box>
  );
}

export default SignMessage;
