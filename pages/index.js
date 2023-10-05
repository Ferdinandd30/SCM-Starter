import {useState, useEffect} from "react";
import {ethers} from "ethers";
import abi from "./contracts/abi.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);

  const [contract, setContract] = useState(undefined);

  const contractAddress = "0x8088c3fD87f9E6EfF17CbD52f787A87E59f7D5B8";
  const [milkBottles, setMilkBottless] = useState(undefined);
  const [eggCrates, setEggCrates] = useState (undefined);

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
    getContract();
  };

  const getContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const IoT = new ethers.Contract(contractAddress, abi, signer);
 
    setContract(IoT);

  }

  const getMilkBottles = async() => {
    if (contract) {
      setMilkBottless((await contract.milkBottles()).toNumber());
    }
  }

  const getEggCrates = async() => {
    if (contract) {
      setEggCrates((await contract.eggCrates()).toNumber());
    }
  }

  const getMilk = async() => {
    if (contract) {
      let tx = await contract.getOneMilk();
      await tx.wait()
      getMilkBottles();
    }
  }

  const getEggs = async() => {
    if (contract) {
      let tx = await contract.getOneEgg();
      await tx.wait()
      getEggCrates();
    }
  }

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <button onClick={connectAccount}>Please connect your Metamask wallet</button>
    }

    if (eggCrates == undefined) {
      getEggCrates();
    }

    if (milkBottles == undefined) {
      getMilkBottles();
    }
    
    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Milk bottles in your fridge: {milkBottles}</p>
        <p>Egg crates in your fridge: {eggCrates}</p>

        <hr></hr>
        <button onClick={getMilk}>get one milk</button>
        <button onClick={getEggs}>get one eggs</button>
        <hr></hr>
      </div>
    )
  }

  useEffect(() => {getWallet();}, []);

  return (
    <main className="container">
      <header><h1>Welcome to the IoT website!</h1></header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center
        }
      `}
      </style>
    </main>
  )
}
