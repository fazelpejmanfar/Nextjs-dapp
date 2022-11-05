import React from 'react'
import Image from 'next/image'
import Opensea from '/public/assets/icons/opensea.png'
import EtherScan from '/public/assets/icons/etherscan.png'
import Twitter from '/public/assets/icons/twitterw.png'
import Discord from '/public/assets/icons/dicordw.png'

function Header() {
  return (
    <div className='w-[95%] h-20 flex justify-between items-center p-3 absolute top-5 bg-blue-500 rounded-full'>
    <div>
    <h1>
        Nextjs Dapp Boilerplate
    </h1>
    </div>

    <div className='flex justify-center items-center gap-2'>
    <a className='social' href='https://' target={'_blank'} rel='noreferrer'>
    <Image src={Opensea} width={30} height={30} alt={'Opensea'}/>
    </a>

    <a className='social' href='https://' target={'_blank'} rel='noreferrer'>
    <Image src={EtherScan} width={30} height={30} alt={'EtherScan'}/>
    </a>

    <a className='social' href='https://' target={'_blank'} rel='noreferrer'>
    <Image src={Twitter} width={30} height={30} alt={'Twitter'}/>
    </a>

    <a className='social' href='https://' target={'_blank'} rel='noreferrer'>
    <Image src={Discord} width={30} height={30} alt={'Discord'}/>
    </a>
    </div>
    </div>
  )
}

export default Header