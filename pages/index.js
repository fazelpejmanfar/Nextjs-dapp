import Head from 'next/head'
import Image from 'next/image'
import { useState, useContext } from 'react'
import Header from '../components/Header';
import Mint from '../components/Mint';
import { EthersContext } from '../context/Connector';

export default function Home() {
  const ETH = useContext(EthersContext);


  return (
    <div className={`flex flex-col min-h-screen justify-center items-center bg-[url("/assets/bg.png")] bg-center bg-cover`}>
      <Head>
        <title>Nextjs Boilerplate Minting Dapp</title>
        <meta name="description" content="Created by Fazel" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header/>
      <section className='w-full px-5'>
      <Mint/>
      </section>

     



      
    </div>
  )
}
