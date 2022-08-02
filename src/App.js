import logo from './logo.svg';
import './App.css';
import { Face, Network } from '@haechi-labs/face-sdk';
import { Blockchain, Env } from '@haechi-labs/face-types';
import { ethers, providers, utils } from 'ethers';
import { useState } from 'react';

const apiKey = "bx89CFIGB12EYcSjcAmgeBRViLr4QSwfce/kCfLj7FLa9w83fh5sd7qGTjv5w8ib9Iq9jXERZD8oxAkknroVQCjlulivVgeLn7wI6Pg0hQiAKWG9GSpvcXpqUpkL1bzNZKNfZNulMlxws6OkVFqbmUHoX4VF1TXrDSZeQetPjK4u4pJH/NosXFn1CaVFCHneM7wc/9ry9p0MmNhXe5t9Nai6UD4JlLyheW8MIuxqTXU=";

function App() {
  const [face, setFace] = useState(null);
  const [login, setLogin] = useState(false);
  const [address, setAddress] = useState(null);
  const [balance, setBalance] = useState(null);
  const [txHash, setTxHash] = useState(null);

  return (
    <div className="App">
      <header className="App-header">
        {face == null &&<button onClick={() => {
                          setFace(new Face(Network.ROPSTEN, Blockchain.ETH, apiKey))
                        }}>
                          Initialize Face
                        </button>
        }
        {(face && !login) && <button onClick={() => {face.auth.login().then(() => setLogin(true)).catch(e => console.error(e))}}>Login</button>}
        {login && <button onClick={async () => {
            const provider = new providers.Web3Provider(face.getEthLikeProvider(), 'any');

            const signer = await provider.getSigner();
            const address = await signer.getAddress();
            console.log("address is", address);
            setAddress(address);
          
            const balance = await signer.getBalance();
            console.log("balance is", balance);
            setBalance(balance.toString());
          
        }}>Query Address And Balance</button>}
        {address && <p>Address: {address}</p>}
        {balance && <p>Balance: {utils.formatEther(balance)}</p>}
        {(address && balance) && <button onClick={async () => {
            const provider = new providers.Web3Provider(face.getEthLikeProvider());

            const signer = await provider.getSigner();
            const transaction = await signer.sendTransaction({
              to: await signer.getAddress(),
              value: utils.parseEther("0.0001"),
            })
            setTxHash(transaction.hash);
        }}>Transfer 0.0001 ETH to me</button>}
        {txHash && <p>Transaction Hash: {txHash}</p>}
        {txHash && <a href={`https://ropsten.etherscan.io/tx/${txHash}`}>Ropsten Link</a>}
      </header>
    </div>
  );
}

export default App;
