import { useConnectModal, useAccountModal } from "@rainbow-me/rainbowkit";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
  useContractReads,
} from "wagmi";
import { useEffect, useState } from "react";
import { ContractAddress, contractChainId } from "../lib/constants";
import toast from "react-hot-toast";
import useWhitelist from "./useWhitelist";

function useContract() {
  const { address } = useAccount();
  const [Token, setToken] = useState(1);
  const { GetUserProof, getMerkleRoot } = useWhitelist();

  const {
    data: CollectionInfo,
    isError: CollectionInfoErr,
    isLoading: CollectionInfoLoading,
    isFetched: CinfoFetched,
    isSuccess: Cinfosucess,
  } = useContractReads({
    contracts: [
      {
        ...ContractAddress,
        functionName: "totalSupply",
        chainId: contractChainId,
      },
      {
        ...ContractAddress,
        functionName: "maxSupply",
        chainId: contractChainId,
      },
      {
        ...ContractAddress,
        functionName: "cost",
        chainId: contractChainId,
      },
      {
        ...ContractAddress,
        functionName: "preSale",
        chainId: contractChainId,
      },
      {
        ...ContractAddress,
        functionName: "WlSupply",
        chainId: contractChainId,
      },
      {
        ...ContractAddress,
        functionName: "wlcost",
        chainId: contractChainId,
      },
    ],
    watch: true,
  });


  const {
    config: PublicMintConfig,
    isError: PublicMintisErr,
    error: PublicMintConfigCheckErr,
  } = usePrepareContractWrite({
    address: ContractAddress.address,
    abi: ContractAddress.abi,
    functionName: "mint",
    args: [Token],
    value: Cinfosucess ? CollectionInfo[2].result * BigInt(Token) : "0",
  });

  const {
    data: PublicMintData,
    isLoading: PublicMintTXLoading,
    write: PublicMint,
    error: PublicMintTXErr,
  } = useContractWrite(PublicMintConfig);

  const { isSuccess: PublicMintSuccess } = useWaitForTransaction({
    hash: PublicMintData?.hash,
  });

  const {
    config: PresaleMintConfig,
    isError: PresaleisErr,
    error: PresaleMintConfigCheckErr,
  } = usePrepareContractWrite({
    address: ContractAddress.address,
    abi: ContractAddress.abi,
    functionName: "presalemint",
    args: Cinfosucess ? [Token, GetUserProof(address)] : [0, [""]],
    value: Cinfosucess ? CollectionInfo[5].result * BigInt(Token) : "0",
  });

  const {
    data: PresaleMintData,
    isLoading: PresaleMintTXLoading,
    write: PresaleMint,
    error: PresaleMintTXErr,
  } = useContractWrite(PresaleMintConfig);

  const { isSuccess: PresaleMintSuccess } = useWaitForTransaction({
    hash: PresaleMintData?.hash,
  });

  const HandleMint = async () => {
    try {
      if (!CollectionInfo[3].result) {
        if (PublicMintConfigCheckErr) {
          throw new Error(PublicMintConfigCheckErr);
        }
        const publicMint = await PublicMint?.();
      } else {
        if (PresaleMintConfigCheckErr) {
          throw new Error(PresaleMintConfigCheckErr);
        }
        const userproof = await GetUserProof(address);
        const presaleMint = await PresaleMint?.();
      }
    } catch (err) {
      toast.dismiss();
      toast.error(err.message.split(":")[3].split("\n")[0]);
      console.log(err);
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
    if (PublicMintTXLoading || PresaleMintTXLoading) {
      toast.dismiss();
      toast.loading("Minting...");
    }
    if (PublicMintSuccess || PresaleMintSuccess) {
      toast.dismiss();
      toast.success("Minted");
    }
    if (PublicMintTXErr) {
      toast.dismiss();
      toast.error(PublicMintTXErr.message.split("\n")[0]);
    }
    if (PresaleMintTXErr) {
      toast.dismiss();
      toast.error(PresaleMintTXErr.message.split("\n")[0]);
    }
  }, [
    PublicMintTXLoading,
    PresaleMintTXLoading,
    PublicMintSuccess,
    PresaleMintSuccess,
    PublicMintTXErr,
    PresaleMintTXErr,
  ]);

  return {
    HandleMint,
    IncrementTokens,
    DecrementTokens,
    Token,
    CollectionInfo,
    PublicMintTXLoading,
    PresaleMintTXLoading,
  };
}

export default useContract;
