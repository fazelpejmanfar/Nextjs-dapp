import Head from 'next/head'
import Image from 'next/image'
import { React, useState, useContext } from 'react'
import { EthersContext } from '../context/Connector';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-cube";
import { EffectCube, Autoplay } from "swiper";
import NFT1 from '/public/assets/nfts/1.png'
import NFT2 from '/public/assets/nfts/2.png'
import NFT3 from '/public/assets/nfts/3.png'
import NFT4 from '/public/assets/nfts/4.png'
import NFT5 from '/public/assets/nfts/5.png'
import NFT6 from '/public/assets/nfts/6.png'
import NFT7 from '/public/assets/nfts/7.png'
import NFT8 from '/public/assets/nfts/8.png'
import NFT9 from '/public/assets/nfts/9.png'
import NFT10 from '/public/assets/nfts/10.png'


function Mint() {
    const ETH = useContext(EthersContext);
    const [Token, setToken] = useState(1);

    const IncrementTokens = () => {
     let NewTokens = Token + 1;
     if(ETH.Presale) {
        if(NewTokens > ETH.MaxPerWallet) {
            NewTokens = ETH.MaxPerWallet;
        }
     } else {
        if(NewTokens > ETH.MaxPerWalletWL) {
            NewTokens = ETH.MaxPerWalletWL;
        }
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
    <div className='flex flex-col justify-center items-center space-y-5 w-full'>

    <div>
    <button className={`${ETH.address ? 'hidden' : 'block'} w-[200px] h-[50px] font-bold bg-white shadow-lg rounded-md hover:bg-slate-200 transition-all ease-in-out`} onClick={(e) => {
      e.preventDefault();
        ETH.connect();
    }}>
      Connect Wallet
    </button>
      </div>


      <div id='containerbox' className={`${ETH.address ? 'flex' : 'hidden'} bg-zinc-300 text-center flex-col sm:flex-row sm:justify-around justify-center items-center space-y-5 sm:space-y-0 p-2 w-[95%] lg:w-[60%] min-h-[400px] shadow-lg rounded-tl-2xl rounded-br-2xl`}>
      <div className='sm:w-[300px] w-[250px]'>
      <Swiper
        effect={"cube"}
        grabCursor={true}
        cubeEffect={{
          shadow: true,
          slideShadows: true,
          shadowOffset: 20,
          shadowScale: 0.94,
        }}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
        }}
        modules={[EffectCube, Autoplay]}
        className="mySwiper"
      >
        <SwiperSlide>
        <Image className='rounded-md' src={NFT1} width={300} height={300} alt='nft' />
        </SwiperSlide>
        <SwiperSlide>
        <Image className='rounded-md' src={NFT2} width={300} height={300} alt='nft' />
        </SwiperSlide>
        <SwiperSlide>
        <Image className='rounded-md' src={NFT3} width={300} height={300} alt='nft' />
        </SwiperSlide>
        <SwiperSlide>
        <Image className='rounded-md' src={NFT4} width={300} height={300} alt='nft' />
        </SwiperSlide>
        <SwiperSlide>
        <Image className='rounded-md' src={NFT5} width={300} height={300} alt='nft' />
        </SwiperSlide>
        <SwiperSlide>
        <Image className='rounded-md' src={NFT6} width={300} height={300} alt='nft' />
        </SwiperSlide>
        <SwiperSlide>
        <Image className='rounded-md' src={NFT7} width={300} height={300} alt='nft' />
        </SwiperSlide>
        <SwiperSlide>
        <Image className='rounded-md' src={NFT8} width={300} height={300} alt='nft' />
        </SwiperSlide>
        <SwiperSlide>
        <Image className='rounded-md' src={NFT9} width={300} height={300} alt='nft' />
        </SwiperSlide>
        <SwiperSlide>
        <Image className='rounded-md' src={NFT10} width={300} height={300} alt='nft' />
        </SwiperSlide>
      </Swiper>
      </div>

      <div id='mintinfo' className='flex flex-col justify-center items-center space-y-5'>
      <p className='bg-white p-2 rounded-md shadow-md text-md sm:text-xl'>
     <span className='animate-pulse'>{ETH.Presale ? "Presale" : "Publicsale"}</span>
     </p>

      <p className='p-2'>
      Your Wallet: {String(ETH.address).substring(0,6)}....{String(ETH.address).substring(36,42)}
     </p>

     <p className='text-md'>
    {ETH.Minted} of {ETH.Presale ? ETH.WLSupply : ETH.Supply} Minted
    </p>

    <div className='flex justify-center items-center space-x-5 p-2 bg-white rounded-md shadow-lg'>
    <button className=' w-10 h-10 rounded-full bg-slate-700 text-white font-bold hover:bg-slate-500 transition-all ease-in-out shadow-xl' onClick={(e) => {
      e.preventDefault();
      DecrementTokens();
    }}>
      -
    </button>
    <h1>
      {Token}
    </h1>
    <button className=' w-10 h-10 rounded-full bg-slate-700 text-white font-bold hover:bg-slate-500 transition-all ease-in-out shadow-xl' onClick={(e) => {
      e.preventDefault();
      IncrementTokens();
    }}>
      +
    </button>
    </div>

    <p className=' text-md'>
        {ETH.Presale ? String(ETH.WLPrice * Token / 1e18) : String(ETH.Price * Token / 1e18)} ETH
    </p>

    <div>
    <button className={` w-[150px] h-[50px] font-bold bg-white shadow-lg rounded-md hover:bg-slate-200 transition-all ease-in-out`} onClick={(e) => {
      e.preventDefault();
        if(ETH.Presale) {
            ETH.PresaleMint(Token);
        } else {
            ETH.Mint(Token);  
        }
    }}>
      Mint
    </button>
      </div>

      </div>
      </div>
   
    </div>
  )
}

export default Mint