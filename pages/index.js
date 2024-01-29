import {useState, useEffect} from "react";
import {ethers} from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [cart, setCart] = useState({ pen: 0, notebook: 0 }); // New state for the cart

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async() => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({method: "eth_accounts"});
      handleAccount(account);
    }
  }

  const handleAccount = (account) => {
    if (account) {
      console.log ("Account connected: ", account);
      setAccount(account);
    }
    else {
      console.log("No account found");
    }
  }

  const connectAccount = async() => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }
  
    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);
    
    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);
 
    setATM(atmContract);
  }

  const getBalance = async() => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  }

  const pen = async() => {
    if (atm) {
      let tx = await atm.pen(1);
      await tx.wait()
      getBalance();
      updateCart("pen"); // Update cart after buying a pen
    }
  }

  const notebook = async() => {
    if (atm) {
      let tx = await atm.notebook(2);
      await tx.wait()
      getBalance();
      updateCart("notebook"); // Update cart after buying a notebook
    }
  }

  const updateCart = (item) => {
    // Update the cart based on the item bought
    setCart((prevCart) => ({
      ...prevCart,
      [item]: prevCart[item] + 1,
    }));
  };

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <button onClick={connectAccount}>Please connect your Metamask wallet</button>
    }

    if (balance == undefined) {
      getBalance();
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Your Balance: {balance}</p>
        <p>Your Cart:</p>
        <p>Pens: {cart.pen}</p>
        <p>Notebooks: {cart.notebook}</p>
        <button onClick={pen}>Buy Pen: 1 ETH</button>
        <button onClick={notebook}>Buy Notebook: 2 ETH</button>
      </div>
    )
  }

  useEffect(() => {getWallet();}, []);

  return (
    <main className="container">
      <header><h1>Welcome to the Meta Stationers!</h1></header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center
        }

        header {
          background-color: #4CAF50;
          padding: 15px;
          color: black;
        }

      `}
      </style>
    </main>
  )
}
