import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import React, { useEffect, useRef, useState } from "react"
import Web3Modal from "web3modal"
import { Contract, providers, utils } from "ethers";
import {abi, contract_address} from '../constants'

export default function Home() {
  const totalSupply = 10
  const [tokenMinted, setTokenMinted] = useState(0)
  const [walletConnected, setWalletConnected] = useState(false)
  const web3ModalRef = useRef()
  const [accountAddress, setAccountAddress] = useState(undefined)
  const [loading, setLoading] = useState(false)
  const [nftData, setNftData] = useState([])

  useEffect(() => {
    if(!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "mumbai",
        providerOptions: {},
        disableInjectedProvider: false,
      })
    }
    connectWallet()
    mintedTokenCount()
    setInterval(async function () {
      await mintedTokenCount();
    }, 5 * 1000);

  }, [walletConnected])

  const connectWallet = async () => {
    try{
      await getProviderOrSigner()
      setWalletConnected(true)
    }catch(error) {
      console.log(error)
    }
  }
  const getProviderOrSigner = async (needSigner = false) => {
    // Connect to Metamask
    // Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);
    const accounts = await web3Provider.listAccounts()
    console.log(accounts[0])
    setAccountAddress(accounts[0])
    // If user is not connected to the Mumbai network, let them know and throw an error
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 80001) {
      window.alert("Change the network to Mumbai");
      throw new Error("Change network to Mumbai");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  }

  const renderConnectButton = () => {
    if(!walletConnected){
      return(
        <button onClick={connectWallet} className={styles.button}>Connect Wallet</button>
      )
    }
    return (
      <div>Connected to {accountAddress}</div>
    )
  }
  const renderMint = () => {
    return (
      <button onClick={publicMint} className={styles.button}>Public Mint 🚀</button>
    )
  }

  const publicMint = async () => {
    try{
      console.log('Public Mint')
      const signer = await getProviderOrSigner(true)
      const contract = new Contract(contract_address, abi, signer)
      const tx = await contract.mint({
        value: utils.parseEther("0.01"),
      })
      setLoading(true)
      await tx.wait()
      setLoading(false)
      window.alert("You successfully minted a VI NFT")
      console.log('transaction details:',tx)
    }catch(error){
      console.log(error)
    }
  }

  const mintedTokenCount = async () => {
    try{
      //console.log('Get minted token count from contract')
      const provider = await getProviderOrSigner()
      const contract = new Contract(contract_address, abi, provider)
      const tokenMinted = await contract.tokenIds()
      //console.log(tokenMinted)
      setTokenMinted(tokenMinted.toString())
    }catch(error){
      console.log(error)
    }
  }

  const tokenURI = async (tokenId) => {
    try{
      console.log('get token uri from contract')
      const provider = await getProviderOrSigner()
      const contract = new Contract(contract_address, abi, provider)
      const uri = await contract.tokenURI(tokenId)
      //console.log(uri)
      let url = "https://" + uri.toString() 
      //console.log(url)
      fetch(url)
        .then(result => result.json())
        .then((output) => {
            console.log('Output: ', output);
            console.log(output["name"])
            console.log(output["description"])
            console.log(output["image"])
            setNftData((nftData) => [...nftData, output])
        }).catch(err => console.error(err));
    }catch(error){
      console.log(error)
    }
  }

  const getURI = ()=>{
    for (let id = 1; id <= tokenMinted; id++){
      console.log(id)
      tokenURI(id);
      console.log('nftData', nftData)
    }
  };

  


  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="VI punks Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
     <div className={styles.main}>
       <div>
        <img className={styles.image} src="./home.jpeg" />
      </div>
      <div>
      <h1 className={styles.title}>Welcome to VI Punks!</h1>
      <div className={styles.description}>
        Its a unique collection of {totalSupply} VI NFTs 
      </div>
      <div className={styles.description}>
        {tokenMinted}/{totalSupply} NFTs have been minted
      </div>
      {renderConnectButton()}
      {renderMint()}
    </div>
      <div>
        <button onClick={getURI} className={styles.button}>TokenURI</button>
        Minted NFT details
      </div> 
     </div>
      
      <footer className={styles.footer}>
        Made with &#10084; by Veritas Interactive
      </footer>
    </div>
  )
}
