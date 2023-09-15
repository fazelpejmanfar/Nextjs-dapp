import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useContractReads } from "wagmi";
import { ContractAddress } from "../lib/constants";
import { useEffect, useState } from "react";
import {  keccak256 } from "ethers";
import { useContractWrite, usePrepareContractWrite, useAccount } from "wagmi";
import { toast } from "react-hot-toast";
import useSWR from "swr";

function useContract() {
  /*   const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data: Whitelist, error } = useSWR("/Whitelist/Accounts.json", fetcher);
*/
  const { address } = useAccount();
  const [Token, setToken] = useState(1);
  const [isMinting, setisMinting] = useState(false);
  const [UserProof, setUserProof] = useState([]);

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
      }
    ],
    watch: true,
  });

  const IncrementTokens = () => {
    let NewTokens = Token + 1;
    setToken(NewTokens);
  };

  const DecrementTokens = () => {
    let NewTokens = Token - 1;
    if (NewTokens < 1) {
      NewTokens = 1;
    }
    setToken(NewTokens);
  };

  const { config } = usePrepareContractWrite({
     ContractAddress,
    functionName: 'mint',
    args: [1]
  })








  return {
    CollectionInfo,
    Token,
    isMinting,
    IncrementTokens,
    DecrementTokens,
  };
}

export default useContract;
