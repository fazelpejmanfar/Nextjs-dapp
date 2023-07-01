import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useContractReads } from "wagmi";
import { ContractAddress } from "../lib/constants";
import { useEffect, useState } from "react";
import { ethers, keccak256 } from "ethers";
import { useWalletClient, useAccount } from "wagmi";
import { toast } from "react-hot-toast";
import useSWR from "swr";

function useContract() {
  /*   const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data: Whitelist, error } = useSWR("/Whitelist/Accounts.json", fetcher);
*/

  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();
  const [Token, setToken] = useState(1);
  const [isMinting, setisMinting] = useState(false);
  const [Contract, setContract] = useState();
  const [UserProof, setUserProof] = useState([]);
  const [userInfo, setuserInfo] = useState({ public: 0, presale: 0 });
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
        functionName: "paused",
      },
      {
        ...ContractAddress,
        functionName: "MaxperWallet",
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
      {
        ...ContractAddress,
        functionName: "MaxperWalletWl",
      },
    ],
    watch: true,
  });

  const IncrementTokens = () => {
    let NewTokens = Token + 1;
    if (CollectionInfo[5].result) {
      if (NewTokens > 2) {
        NewTokens = 2;
      }
    } else {
      if (NewTokens > 3) {
        NewTokens = 3;
      }
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

  /*   const PresaleMint = async (Token) => {
    if (Paused) {
      toast.dismiss();
      toast.error("Contract is Paused...");
      return;
    }
    if (UserProof.length <= 0) {
      toast.dismiss();
      toast.error("You are not Whitelisted...");
      return;
    }
    if (Number(Minted) >= Number(WLSupply)) {
      toast.dismiss();
      toast.success("SOLD OUT");
      return;
    }
    if (Number(UserMintedPresale + Token) > Number(MaxPerWalletWL)) {
      toast.dismiss();
      toast.error("Wallet Limit Reached");
      return;
    }
    if (
      MRoot ==
      "0x0000000000000000000000000000000000000000000000000000000000000000"
    ) {
      toast.dismiss();
      toast.error("Sale hasn't Started Yet...");
      return;
    }
    try {
      setisMinting(true)
      toast.loading("Minting...");
      let price = String(Token * Price);
      const mint = await Contract.presalemint(Token, UserProof, {
        from: address,
        value: price,
      });
      const TX = await mint.wait().then(async (receipt) => {
        toast.dismiss();
        toast.success("Mint done");
                const getpublicmint = await Contract.PublicMintofUser(address);
        const getwlmint = await Contract.WhitelistedMintofUser(address);
        setuserInfo({
          public: Number(getpublicmint),
          presale: Number(getwlmint)
        })
        setisMinting(false)
      });
    } catch (err) {
      const newErr = err.message.replace(/\(.*\)/, "");
      toast.dismiss();
      toast.error(String(newErr));
      console.log(newErr);
      setisMinting(false)
    }
  }; */

  const PublicMint = async () => {
    if (CollectionInfo[3].result) {
      toast.dismiss();
      toast.error("Sale is Paused...");
      return;
    }
    if (
      Number(CollectionInfo[0].result) + Number(Token) >
      Number(CollectionInfo[1].result)
    ) {
      toast.dismiss();
      toast.success("SOLD OUT");
      return;
    }
    if (
      Number(userInfo.public) + Number(Token) >
      Number(CollectionInfo[4].result)
    ) {
      toast.dismiss();
      toast.error("Wallet Limit Reached");
      return;
    }
    try {
      setisMinting(true);
      toast.loading("Minting...");
      let price = String(Number(Token) * Number(CollectionInfo[2].result));
      const mint = await Contract.mint(Token, {
        from: address,
        value: price,
      });
      const TX = await mint.wait().then(async (receipt) => {
        toast.dismiss();
        toast.success("Mint done");
        const getpublicmint = await Contract.PublicMintofUser(address);
        const getwlmint = await Contract.WhitelistedMintofUser(address);
        setuserInfo({
          public: Number(getpublicmint),
          presale: Number(getwlmint),
        });
        setisMinting(false);
      });
    } catch (err) {
      const newErr = err.message.replace(/\(.*\)/, "");
      toast.dismiss();
      toast.error(String(newErr));
      console.log(err);
      setisMinting(false);
    }
  };

  useEffect(() => {
    const getdata = async () => {
      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      const CT = new ethers.Contract(
        ContractAddress.address,
        ContractAddress.abi,
        signer
      );
      setContract(CT);
      const getpublicmint = await CT.PublicMintofUser(address);
      const getwlmint = await CT.WhitelistedMintofUser(address);
      setuserInfo({
        public: Number(getpublicmint),
        presale: Number(getwlmint),
      });
    };

    if (address && walletClient && !Contract) {
      getdata();
      console.clear();
      console.log("Made by FazelPejmanfar");
    }
  }, [address, walletClient, Contract]);

  return {
    CollectionInfo,
    Token,
    isMinting,
    IncrementTokens,
    DecrementTokens,
    PublicMint,
  };
}

export default useContract;
