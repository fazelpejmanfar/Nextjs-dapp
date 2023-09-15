import Head from "next/head";
import Image from "next/image";
import { motion } from "framer-motion";
import { useConnectModal, useAccountModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/solid";
import useContract from "../hooks/useContract";

function Mint() {
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { address } = useAccount();
  const {
    HandleMint,
    CollectionInfo,
    PublicMintTXLoading,
    PresaleMintTXLoading,
    IncrementTokens,
    DecrementTokens,
    Token,
  } = useContract();

  return (
    <motion.div
      className="flex flex-col justify-center items-center space-y-5 w-full py-5"
      initial={{
        opacity: 0,
        scale: 0.5,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      transition={{
        duration: 1,
      }}
    >
      
      <div
        className={`border border-[#60B7BC] relative flex bg-gradient-to-b from-[#AED8DA] from-50% to-white text-black shadow-2xl text-center flex-col justify-center items-center p-2 w-[95%] lg:w-[600px] min-h-[300px] rounded-xl`}
      >
        <div className="absolute border-2 border-[#60B7BC] left-3 h-full"/>
        <div className="absolute border-2 border-[#60B7BC] right-3 h-full"/>
        <div className="flex flex-col justify-center items-center space-y-4 z-10 w-full px-5">
          {!address ? (
            <>
              <h1 className="text-2xl sm:text-3xl">pomedoge minting dapp</h1>
              <button className="btns w-fit " onClick={openConnectModal}>
                Connect Wallet
              </button>
            </>
          ) : (
            <>
              <div className="w-full flex justify-between items-center border-b-4 border-[#60B7BC] py-2">
                <p className="sm:text-xl text-base">
                  {String(address).substring(0, 4)}...
                  {String(address).substring(38, 42)}
                </p>
                <button
                  className="bg-[#60B7BC] hover:bg-[#3e898d] rounded-md p-2 text-black text-xs"
                  onClick={openAccountModal}
                >
                  Account Info
                </button>
              </div>
              <div className="w-full flex justify-between items-center">
                <h1 className="titleinfo">Status: </h1>
                <h3 className="textinfo">
                  {CollectionInfo[3]?.result ? "Presale" : "Public"}
                </h3>
              </div>
              <div className="w-full flex justify-between items-center">
                <h1 className="titleinfo">Supply</h1>
                <h3 className="textinfo">
                  {Number(CollectionInfo[0]?.result)} /{" "}
                  {Number(CollectionInfo[1]?.result)}
                </h3>
              </div>

              <div className="w-full flex justify-between items-center">
                <h1 className="titleinfo">Price: </h1>
                {!CollectionInfo[3]?.result ? (
                  <h3 className="textinfo">
                    {(Number(CollectionInfo[2].result) * Number(Token)) / 1e18}{" "}
                    ETH
                  </h3>
                ) : (
                  <h3 className="textinfo">
                    {(Number(CollectionInfo[5].result) * Number(Token)) / 1e18}{" "}
                    ETH
                  </h3>
                )}
              </div>
              <div
                className={`w-full flex flex-col justify-center items-center gap-3 ${
                  address ? "opacity-100" : "opacity-0"
                } transition-all ease-in-out`}
              >
                <div className="flex justify-between items-center p-2 rounded-md w-[180px]">
                  <button
                    className="incrementbtn"
                    disabled={PublicMintTXLoading || PresaleMintTXLoading}
                    onClick={(e) => {
                      e.preventDefault();
                      DecrementTokens();
                    }}
                  >
                    <ChevronDoubleLeftIcon className="w-6 h-6 fill-black" />
                  </button>
                  <h1 className=" font-bold text-3xl">{Token}</h1>
                  <button
                    className="incrementbtn"
                    disabled={PublicMintTXLoading || PresaleMintTXLoading}
                    onClick={(e) => {
                      e.preventDefault();
                      IncrementTokens();
                    }}
                  >
                    <ChevronDoubleRightIcon className="w-6 h-6 fill-black" />
                  </button>
                </div>
              </div>

              <button
                className={`btns ${PublicMintTXLoading || PresaleMintTXLoading ? "animate-pulse" : ""}`}
                disabled={PublicMintTXLoading || PresaleMintTXLoading}
                onClick={() => HandleMint()}
              >
                Mint
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default Mint;
