import Head from 'next/head'
import Image from 'next/image'
import { useState, useContext } from 'react'
import Header from '../components/Header';
import { EthersContext } from '../context/Connector';

export default function Home() {
  const ETH = useContext(EthersContext);
  const [Token, setToken] = useState(1);

   const IncrementTokens = () => {
    let NewTokens = Token + 1;
    if(NewTokens > 5) {
        NewTokens = 5;
    }
    setToken(NewTokens)
    };
    
     const DecrementTokens = () => {
        let NewTokens = Token - 1;
        if(NewTokens < 1) {
            NewTokens = 1;
        }
        setToken(NewTokens)
    };

  return (
    <div className='flex flex-col min-h-screen justify-center items-center bg-[#EDF4ED]'>
      <Head>
        <title>Nextjs Boilerplate</title>
        <meta name="description" content="Created by Fazel" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header/>

      <div className='flex flex-col justify-center items-center space-y-5'>
      <button className='w-[200px] h-[50px] font-bold bg-blue-500 rounded-md hover:scale-90 transition-all' onClick={(e) => {
        e.preventDefault();
        if(!ETH.address) {
          ETH.connect();
        } else {
          ETH.disconnect();
        }
      }}>
        {ETH.address ? "Disconnect" : "Connect Wallet"}
      </button>

      <p>
        {ETH?.address}
      </p>

      <div style={{ display: ETH.address ? "flex" : "none" }} className='flex justify-center items-center space-x-5'>
      <button className=' w-10 h-10 rounded-full bg-blue-600 text-white font-bold hover:scale-95 transition-all' onClick={(e) => {
        e.preventDefault();
        DecrementTokens();
      }}>
        -
      </button>
      <h1>
        {Token}
      </h1>
      <button className=' w-10 h-10 rounded-full bg-blue-600 text-white font-bold hover:scale-95 transition-all' onClick={(e) => {
        e.preventDefault();
        IncrementTokens();
      }}>
        +
      </button>
      </div>

      <p>
      {ETH.Minted} || {ETH.Supply}
      </p>
      </div>



      
    </div>
  )
}
