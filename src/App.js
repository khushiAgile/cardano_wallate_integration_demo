import './App.css';
import ConnectCardanoWallet from './wallet'
import ConnectCardanoLucidWallet from './lucidWallet';


function App() {
  return (
    <div className="App">
      <h1>Cardano Wallet Demo</h1>
      <ConnectCardanoWallet></ConnectCardanoWallet>
      <ConnectCardanoLucidWallet></ConnectCardanoLucidWallet>
    </div>
  );
}

export default App;
