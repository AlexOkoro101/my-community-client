import { ethers } from "ethers";
import Head from 'next/head'
import { useEffect, useState } from 'react';
import abi from '../src/utils/WavePortal.json'
import Navbar from "../src/components/Navbar";
import Link from 'next/link'

export default function Home() {
  console.log("address", process.env.CONTRACT_ADDRESS)
  const [currentAccount, setcurrentAccount] = useState("");
  const contractAddress = process.env.CONTRACT_ADDRESS;
  const contractABI = abi.abi;
  

  useEffect(() => {
    checkIfConnectedToWallet()
  
  }, [])

  useEffect(() => {
    let wavePortalContract;

    const onNewWave = (from, timestamp, message) => {
      console.log("NewWave", from, timestamp, message)
      setallWaves(prevState => [
        ...prevState, {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message: message,
        }
      ]);
    };

    if(window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
      wavePortalContract.on("NewWave", onNewWave);
    }
  
    return () => {
      if(wavePortalContract) {
        wavePortalContract.off("NewWave", onNewWave);
      }
    }
  }, [])
  

  

  const checkIfConnectedToWallet = async () => {

    try {
        const { ethereum } = window;
    
        if(!ethereum) {
          console.log("Make you have metamask")
        } else {
          console.log("Our ethereum object is", ethereum)
        }

        const accounts = await ethereum.request({method: "eth_accounts"});
    
        if(accounts.length !== 0) {
          const account = accounts[0];
          console.log("Found authorized account", account)
          setcurrentAccount(account);
          getAllWaves()
        } else {
          console.log("No authorized account found")
        }
    } catch (err) {
      console.log(err)
    }

  }

  //Connect Wallet
  const connectWallet = async () => {
    try {
      const {ethereum} = window;

      if(!ethereum) {
        alert("Please Get MetaMask")
        return
      }

      const accounts = await ethereum.request({method: "eth_requestAccounts"});

      console.log("Connected", accounts[0])
      setcurrentAccount(accounts[0])
     
    } catch (err) {
      console.log(err)
    }
  }

  const getAllWaves = async() => {
    const {ethereum} = window;
    try {
        if(ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
          const waves = await wavePortalContract.getAllWaves()



          let wavesCleaned = [];
          waves.forEach(wave => {
            wavesCleaned.push({
              address: wave.waver,
              timestamp: new Date(wave.timestamp * 1000),
              message: wave.message
            });
          });


          setallWaves(wavesCleaned);
          console.log("waves set")
        } else {
          console.log("Ethereum object not found")
        }
    } catch (err) {
      console.log(err)
    }
  }

  
  return (
    <div className="bg-[#e4e6ec] px-8 xl:px-56 font-primary">

      <Head>
        <title>My First Web3</title>
        <meta name="description" content="Alex's web3" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <main className="mt-10 h-screen">
        <header className="mb-10">
          <h1 className="font-extrabold text-4xl md:text-6xl">
            Welcome to <br /> <span className="text-[#e76994]"> My Community!</span>
          </h1>
          <p className="text-gray-500 text-sm leading-6 mt-1">Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium sapiente repellat et nesciunt. Tempore, consequatur? Nobis quidem reprehenderit soluta ipsum magni veniam, dolorem ab corrupti, explicabo consequuntur inventore voluptas. Eius!</p>
        </header>
        {!currentAccount ? (
          <button className="flex items-center bg-white px-4 py-2 rounded-md hover:bg-transparent hover:text-white hover:border hover:border-white text-lg" onClick={connectWallet}>
            Login with MetaMask
          </button>

        ) : (
          <>
            <p>You are connected...</p>
            <Link href="/interact">
              <button className="py-3 text-lg flex gap-2 items-center px-8 bg-green-500 text-white my-5 rounded-md">
                Gist Us 
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path></svg>
              </button>
            </Link>
            
          </>
        )}
      </main>  
    </div>
  )
}
