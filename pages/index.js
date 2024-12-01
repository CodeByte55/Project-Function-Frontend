import {useState, useEffect} from "react";
import {ethers} from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);

  const [message, setMessage] = useState("");
  const [count, setCount] = useState(0);
  const [newMessage, setNewMessage] = useState("");

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
    fetchContractData();
  };

  const fetchContractData = async () => {
    if (!ethWallet) {
      console.error("MetaMask not found");
      return;
    }
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, atmABI, signer);

    const currentMessage = await contract.message();
    const currentCount = await contract.count();

    setMessage(currentMessage);
    setCount(currentCount.toNumber());
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

    return (
      <div>
        <p>Your Account: {account}</p>
      </div>
    )
  }

  // Update the message
  const updateMessage = async () => {
    if (!ethWallet) {
      console.error("MetaMask not found");
      return;
    }
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, atmABI, signer);

    const tx = await contract.setMessage(newMessage);
    await tx.wait();
    fetchContractData();
  };

  // Increment the counter
  const incrementCounter = async () => {
    if (!window.ethereum) {
      console.error("MetaMask not found");
      return;
    }
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, atmABI, signer);

    const tx = await contract.incrementCounter();
    await tx.wait();
    fetchContractData();
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header><h1>Welcome to Project: Function Frontend</h1></header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center
        }
      `}
      </style>

      <div style={{ padding: "20px" }}>
        <h1>Simple Contract Frontend</h1>
          <p>
            <strong>Message:</strong> {message}
          </p>
          <p>
            <strong>Counter:</strong> {count}
          </p>
          <div>
            <input
              type="text"
              placeholder="Enter new message"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button onClick={updateMessage}>Update Message</button>
          </div>
          <button onClick={incrementCounter}>Increment Counter</button>
      </div>
    </main>
  )
}
