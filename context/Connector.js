import { createContext, useState, useEffect, useContext } from "react";
import { ethers } from "ethers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";
import { toast } from "react-hot-toast";
import ABI from "./abi.json";
import useSWR from "swr";

export const EthersContext = createContext({});
export const useETH = () => useContext(EthersContext);

export default function Wrapper({ children }) {
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data, error } = useSWR("/Whitelist/Accounts.json", fetcher);
  const WLS = data;

  const { MerkleTree } = require("merkletreejs");
  const keccak256 = require("keccak256");
  const [address, setaddress] = useState();
  const [isConnected, setisConnected] = useState(false);
  const [Contract, setContract] = useState();
  const [Provider, setProvider] = useState();
  const [Price, setPrice] = useState(0.012);
  const [WLPrice, setWLPrice] = useState(0.012);
  const [Supply, setSupply] = useState(999);
  const [WLSupply, setWLSupply] = useState(999);
  const [Minted, setMinted] = useState(0);
  const [MaxPerWallet, setMaxperWallet] = useState(2);
  const [MaxPerWalletWL, setMaxperWalletWL] = useState(2);
  const [UserMinted, setUserMinted] = useState(0);
  const [UserMintedPresale, setUserMintedPresale] = useState(0);
  const [Presale, setPresale] = useState(true);
  const [Paused, setPaused] = useState(false);
  const [UserProof, setUserProof] = useState([]);
  const [MRoot, setMRoot] = useState();
  const ContractAddress = "0x9EE4490A25C674Faa300327925b453698c413A32";
  const ChainID = { network: "Goerli", ID: 5 };

  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      display: {
        name: "Wallet Connect",
        description: "Scan qrcode with your mobile wallet",
      },
      options: {
        infuraId: "INFURA_ID", // required
      },
    },
  };

  const connect = async () => {
    const web3Modal = new Web3Modal({
      network: "mainnet", // optional
      cacheProvider: false, // optional
      providerOptions,
      theme: "dark",
    });
    try {
      toast.loading("Connecting...");
      const instance = await web3Modal.connect();
      setProvider(instance);
      const provider = new ethers.providers.Web3Provider(instance);
      const signer = await provider.getSigner();
      const account = await provider.listAccounts();
      const network = await provider.getNetwork();
      if (network.chainId !== Number(ChainID.ID)) {
        toast.dismiss();
        toast.error(
          `Wrong Network\n Please Change Network to ${ChainID.network}`
        );
        return;
      }
      const CT = new ethers.Contract(ContractAddress, ABI, signer);
      setContract(CT);
      const supply = await CT.maxSupply();
      setSupply(Number(supply));
      const wlsupply = await CT.WlSupply();
      setWLSupply(Number(wlsupply));
      const minted = await CT.totalSupply();
      setMinted(Number(minted));
      const price = await CT.cost();
      setPrice(Number(price));
      const pricewl = await CT.wlcost();
      setWLPrice(Number(pricewl));
      const perwallet = await CT.MaxperWallet();
      setMaxperWallet(Number(perwallet));
      const perwalletwl = await CT.MaxperWalletWl();
      setMaxperWalletWL(Number(perwalletwl));
      const userminted = await CT.PublicMintofUser(account[0]);
      setUserMinted(Number(userminted));
      const usermintedpresale = await CT.WhitelistedMintofUser(account[0]);
      setUserMintedPresale(Number(usermintedpresale));
      const presale = await CT.preSale();
      setPresale(presale);
      const pause = await CT.paused();
      setPaused(pause);
      const mroot = await CT.merkleRoot();
      setMRoot(mroot);
      const leafNodes = WLS.map((addr) => keccak256(addr));
      const merkleTree = new MerkleTree(leafNodes, keccak256, {
        sortPairs: true,
      });
      const rootHash = merkleTree.getRoot();
      console.log("Root Hash: ", "0x" + rootHash.toString("hex"));
      const claimingAddress = keccak256(account[0]);
      const hexProof = merkleTree.getHexProof(claimingAddress);
      setUserProof(hexProof);
      if (hexProof.length <= 0 && presale) {
        toast.dismiss();
        toast.error("You are not whitelisted");
        return;
      } else {
        setaddress(account[0]);
        setisConnected(true);
        toast.dismiss();
        toast.success(
          `Connected to ${
            provider.connection.url === "metamask"
              ? "MetaMask"
              : "Wallet Connect"
          }`
        );
      }
    } catch (err) {
      const newErr = err.message.replace(/\(.*\)/, "");
      toast.dismiss();
      toast.error(String(newErr));
      console.log(newErr);
    }
  };

  const disconnect = () => {
    setaddress();
    setisConnected(false);
  };

  const PresaleMint = async (Token) => {
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
      toast.loading("Minting...");
      let price = String(Token * Price);
      const mint = await Contract.presalemint(Token, UserProof, {
        from: address,
        value: price,
      });
      const TX = await mint.wait().then(async (receipt) => {
        toast.dismiss();
        toast.success("Mint done");
        const minted = await Contract.totalSupply();
        setMinted(Number(minted));
        const usermintedpresale = await Contract.WhitelistedMintofUser(address);
        setUserMintedPresale(Number(usermintedpresale));
      });
    } catch (err) {
      const newErr = err.message.replace(/\(.*\)/, "");
      toast.dismiss();
      toast.error(String(newErr));
      console.log(newErr);
    }
  };

  const Mint = async (Token) => {
    if (Paused) {
      toast.dismiss();
      toast.error("Contract is Paused...");
      return;
    }
    if (Number(Minted) >= Number(Supply)) {
      toast.dismiss();
      toast.success("SOLD OUT");
      return;
    }
    if (Number(UserMinted + Token) > Number(MaxPerWallet)) {
      toast.dismiss();
      toast.error("Wallet Limit Reached");
      return;
    }
    try {
      toast.loading("Minting...");
      let price = String(Token * Price);
      const mint = await Contract.mint(Token, {
        from: address,
        value: price,
      });
      const TX = await mint.wait().then(async (receipt) => {
        toast.dismiss();
        toast.success("Mint done");
        const minted = await Contract.totalSupply();
        setMinted(Number(minted));
        const userminted = await Contract.PublicMintofUser(address);
        setUserMinted(Number(userminted));
      });
    } catch (err) {
      const newErr = err.message.replace(/\(.*\)/, "");
      toast.dismiss();
      toast.error(String(newErr));
      console.log(newErr);
    }
  };

  const controllers = {
    connect,
    disconnect,
    Mint,
    PresaleMint,
    Presale,
    address,
    isConnected,
    Supply,
    WLSupply,
    Minted,
    MaxPerWallet,
    MaxPerWalletWL,
    Price,
    WLPrice
  };

  useEffect(() => {
    if (Provider?.on) {
      const handleAccountsChanged = (accounts) => {
        setaddress(accounts[0]);
      };
      Provider.on("accountsChanged", handleAccountsChanged);
      return () => {
        if (Provider.removeListener) {
          Provider.removeListener("accountsChanged", handleAccountsChanged);
        }
      };
    }
  }, [Provider]);



  return (
    <EthersContext.Provider
      value={controllers}
    >
      {children}
    </EthersContext.Provider>
  );
}
