import Head from "next/head";
import Image from "next/image";
import { motion } from "framer-motion";
import { useConnectModal, useAccountModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import useContract from "../hooks/useContract";
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/solid";
function Mint() {
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { address } = useAccount();
  const {
    CollectionInfo,
    Token,
    IncrementTokens,
    DecrementTokens,
    PublicMint,
    isMinting,
  } = useContract();

  

  return (
    <motion.div
      className="flex flex-col justify-center items-center space-y-5 w-full py-5"
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
      transition={{
        duration: 1,
      }}
    >
      <div
        className={`flex bg-white text-black shadow-2xl text-center flex-col justify-center items-center p-2 w-[95%] lg:w-[600px] min-h-[300px] rounded-xl`}
      >
        <div className="flex flex-col justify-center items-center space-y-4 z-10 w-full px-5">
          {!address ? (
            <>
              <h1 className="text-2xl sm:text-3xl">Welcome to Fantasy World</h1>
              <button className="btns" onClick={openConnectModal}>
                Connect
              </button>
            </>
          ) : (
            <>
              <div className="w-full flex justify-between items-center border-b-4 border-[#2373ff] py-2">
                <p className="sm:text-xl text-base">
                  {String(address).substring(0, 4)}...
                  {String(address).substring(38, 42)}
                </p>
                <button
                  className="bg-[#00abe4] hover:bg-[#2373ff] rounded-md p-2 text-white text-xs"
                  onClick={openAccountModal}
                >
                  Account Info
                </button>
              </div>
              <div className="w-full flex justify-between items-center">
                <h1 className="titleinfo">Status: </h1>
                <h3 className="textinfo">{CollectionInfo[5]?.result ? "Presale" : "Public"}</h3>
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
                <h3 className="textinfo">
                  {(Number(CollectionInfo[2].result) * Number(Token)) / 1e18} ETH
                </h3>
              </div>
              <div
                className={`w-full flex flex-col justify-center items-center gap-3 ${
                  address ? "opacity-100" : "opacity-0"
                } transition-all ease-in-out`}
              >
                <div className="flex justify-between items-center p-2 rounded-md w-[180px]">
                  <button
                    className="incrementbtn"
                    onClick={() => DecrementTokens()}
                  >
                    <ChevronDoubleLeftIcon className="w-6 h-6 fill-white" />
                  </button>
                  <h1 className=" font-bold text-3xl">{Token}</h1>
                  <button
                    className="incrementbtn"
                    onClick={() => IncrementTokens()}
                  >
                    <ChevronDoubleRightIcon className="w-6 h-6 fill-white" />
                  </button>
                </div>
              </div>

              <button
                className="btns"
                disabled={isMinting}
                onClick={() => PublicMint()}
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
