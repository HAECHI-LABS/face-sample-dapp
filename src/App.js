import './App.css';

import { ReactComponent as Logo } from './assets/logo-solid.svg';
import AccountInformation from './components/AccountInformation';
import ConnectNetwork from './components/ConnectNetwork';
import LoginWithFace from './components/LoginWithFace';
import SignMessage from './components/SignMessage';
import TransactionContractCall from './components/TransactionContractCall';
import TransactionErc20 from './components/TransactionErc20';
import TransactionErc721 from './components/TransactionErc721';
import TransactionPlatformCoin from './components/TransactionPlatformCoin.js';
import WalletConnect from './components/WalletConnect';

function App() {
  return (
    <div className="App">
      <Logo />
      <AccountInformation />
      <div className="wrapper">
        <ConnectNetwork />
        <LoginWithFace />
        <WalletConnect />
        <TransactionPlatformCoin />
        <TransactionErc20 />
        <TransactionErc721 />
        <TransactionContractCall />
        <SignMessage />
      </div>
    </div>
  );
}

export default App;
