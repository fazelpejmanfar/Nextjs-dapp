import Head from "next/head";
import Image from "next/image";
import { motion } from "framer-motion";
import { useConnectModal, useAccountModal } from "@rainbow-me/rainbowkit";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
  useContractReads,
} from "wagmi";
import { useEffect, useState } from "react";
import useContract from "../hooks/useContract";
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/solid";
import { ContractAddress } from "../lib/constants";
import toast from "react-hot-toast";

function Mint() {
  const [Token, setToken] = useState(1);
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { address } = useAccount();
  const {
    data: CollectionInfo,
    isError: CollectionInfoErr,
    isLoading: CollectionInfoLoading,
  } = useContractReads({
    contracts: [
      {
        ...ContractAddress,
        functionName: "totalSupply",
      },
      {
        ...ContractAddress,
        functionName: "maxSupply",
      },
      {
        ...ContractAddress,
        functionName: "cost",
      },
      {
        ...ContractAddress,
        functionName: "preSale",
      },
      {
        ...ContractAddress,
        functionName: "WlSupply",
      },
      {
        ...ContractAddress,
        functionName: "wlcost",
      },
    ],
  });

  const {
    config: PublicMintConfig,
    isError,
    error: PublicMintConfigCheckErr,
  } = usePrepareContractWrite({
    address: ContractAddress.address,
    abi: ContractAddress.abi,
    functionName: "mint",
    args: [Token],
    value: CollectionInfo ? (CollectionInfo[2]?.result * BigInt(Token)) : "0",
  });
  
  const {
    data: PublicMintData,
    isLoading: PublicMintTXLoading,
    write,
    error: PublicMintTXErr,
  } = useContractWrite(PublicMintConfig);

  const { isSuccess: PublicMintSuccess } = useWaitForTransaction({
    hash: PublicMintData?.hash,
  });

  const HandleMint = async () => {
    try {
      if (PublicMintConfigCheckErr) {
        throw new Error(PublicMintConfigCheckErr);
      }
      const tx = await write?.();
    } catch (err) {
      toast.dismiss();
      toast.error(err.message.split(":")[3].split("\n")[0]);
    }
  };

  const IncrementTokens = () => {
    let NewTokens = Token + 1;
    if (NewTokens > 10) {
      NewTokens = 10;
    }
    setToken(NewTokens);
  };

  const DecrementTokens = () => {
    let NewTokens = Token - 1;
    if (NewTokens < 1) {
      NewTokens = 1;
    }
    setToken(NewTokens);
  };
  useEffect(() => {
    if (PublicMintTXLoading) {
      toast.dismiss();
      toast.loading("Minting...");
    }
    if (PublicMintSuccess) {
      toast.dismiss();
      toast.success("Minted");
    }
    if (PublicMintTXErr) {
      toast.dismiss();
      toast.error(PublicMintTXErr.message.split("\n")[0]);
    }
  }, [PublicMintTXLoading, PublicMintSuccess, PublicMintTXErr]);

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
                <h3 className="textinfo">
                  {(Number(CollectionInfo[2].result) * Number(Token)) / 1e18}{" "}
                  ETH
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
                    disabled={PublicMintTXLoading}
                    onClick={(e) => {
                      e.preventDefault();
                      DecrementTokens();
                    }}
                  >
                    <ChevronDoubleLeftIcon className="w-6 h-6 fill-white" />
                  </button>
                  <h1 className=" font-bold text-3xl">{Token}</h1>
                  <button
                    className="incrementbtn"
                    disabled={PublicMintTXLoading}
                    onClick={(e) => {
                      e.preventDefault();
                      IncrementTokens();
                    }}
                  >
                    <ChevronDoubleRightIcon className="w-6 h-6 fill-white" />
                  </button>
                </div>
              </div>

              <button
                className="btns"
                disabled={PublicMintTXLoading}
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
