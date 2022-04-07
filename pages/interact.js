import { ethers } from "ethers";
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import Navbar from '../src/components/Navbar'
import dp from '../public/img/bored-ape.jpg'
import Image from 'next/image'
import abi from '../src/utils/WavePortal.json'

function Interact() {
  const [currentAccount, setcurrentAccount] = useState("");
  const [waveCount, setwaveCount] = useState(0);
  const [loading, setloading] = useState(false);
  const [allWaves, setallWaves] = useState([]);
  const [friendlyMessage, setfriendlyMessage] = useState("")
  const contractAddress = process.env.CONTRACT_ADDRESS;
  const contractABI = abi.abi;



  useEffect(() => {
    checkIfConnectedToWallet()
  
  }, [waveCount])

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

  const wave = async (friendlyMessage) => {
    if(friendlyMessage === "") {
      return;
    }

    try {
      const {ethereum} = window;

      if(ethereum) {
        setloading(true)
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer)

        let count = await wavePortalContract.getTotalWaves();
        setwaveCount(count.toNumber())
        console.log("Retrieved total wave count...", count.toNumber());


        // Actual wave from our contract
        const waveTxn = await wavePortalContract.wave(friendlyMessage, {gasLimit: 300000});
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);
        
        count = await wavePortalContract.getTotalWaves();
        setloading(false)
        setfriendlyMessage("")
        console.log("Retieved totla wave count...", count.toNumber());
        setwaveCount(count.toNumber())
      } else {
        console.log("Ethereum object does not exist")
      }
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
    <div className="bg-[#e4e6ec] px-8 xl:px-56 font-primary relative">

      <Head>
        <title>My First Web3 Interact</title>
        <meta name="description" content="Alex's web3" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="fixed top-0 bg-[#e4e6ec] w-full left-0 px-8 xl:px-56  h-screen">
        <Navbar />

        {!currentAccount ? (
          <button className="flex items-center bg-white px-4 py-2 rounded-md hover:bg-transparent hover:text-white text-lg" onClick={connectWallet}>
            Login with MetaMask
          </button>

        ) : (

        <main className="mt-10 h-full">
          <header className="mb-10">
            <h1 className="font-extrabold text-4xl md:text-4xl">
              Int3ract
            </h1>
          </header>

          <div className="input-section bg-[#e4e6ec] border border-gray-300 p-4 mb-10 ">
            <div className="flex gap-4">
                <div className="rounded-full w-16 h-16 flex items-center justify-center overflow-hidden">
                  <Image src={dp}  />
                </div>
                <textarea className="flex-1 h-28 outline-none bg-transparent" value={friendlyMessage} onChange={(e) => setfriendlyMessage(e.target.value)}  placeholder="Naija hard, give us gist..."></textarea>
            </div>
            <div className="flex justify-end">
              <button className="mt-5 rounded-md bg-[#e76994] hover:bg-[#dc5381] text-white p-2 " onClick={() => wave(friendlyMessage)}>
                {loading ? (
                  <>sending...</>
                ) : (
                  <>Give Gist</>
                )}
                </button>
            </div>
          </div>

          {allWaves.length >= 1 && (
            <div className="posts overflow-y-scroll h-2/5">
              {allWaves.map((wave, index) => (
                <article key={index} className="border-b border-gray-300 mb-5 pb-5">
                  <div className="flex gap-4">
                    <div className="rounded-full w-12 h-12 flex items-center justify-center overflow-hidden">
                      <Image src={dp}  />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm">{wave.address}</p>
                      <p className="text-sm">{wave.message}</p>
                      <p className="text-xs text-gray-500 text-right mr-5 mt-1">{wave.timestamp.toLocaleDateString()} {''} {wave.timestamp.toLocaleTimeString()}</p>
                    </div>
                  </div>
                </article>
              ))}
              
            </div>

          )}

        </main>

        )}

      </div>


    </div>      
  )
}

export default Interact