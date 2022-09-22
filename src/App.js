import './App.css';

import { ReactComponent as Logo } from './assets/logo-solid.svg';
import AccountInformation from './components/AccountInformation';
import ConnectNetwork from './components/ConnectNetwork';
import LoginWithFace from './components/LoginWithFace';
import TransactionErc20 from './components/TransactionErc20';
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
      </div>
    </div>
  );
}

export default App;
