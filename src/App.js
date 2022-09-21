import './App.css';
import ConnectNetwork from './components/ConnectNetwork';
import LoginWithFace from './components/LoginWithFace';
import TransactionPlatformCoin from './components/TransactionPlatformCoin.js';
import TransactionErc20 from './components/TransactionErc20';
import { ReactComponent as Logo } from './assets/logo-solid.svg';

function App() {
  return (
    <div className="App">
      <Logo />
      <div className="container">
        <ConnectNetwork />
        <LoginWithFace />
        <TransactionPlatformCoin />
        <TransactionErc20 />
      </div>
    </div>
  );
}

export default App;
