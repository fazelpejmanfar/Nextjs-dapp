import { createContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";
import { toast } from 'react-hot-toast'
import ABI from './abi.json'

export const EthersContext = createContext({});



const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      display: {
        name: "Wallet Connect",
        description: "Scan qrcode with your mobile wallet"
      },
      options: {
        infuraId: "INFURA_ID" // required
      }
    }
  };

export default function Wrapper({ children }) {


  const [address, setaddress] = useState();
  const [isConnected, setisConnected] = useState(false);
  const [Contract, setContract] = useState();
  const [Provider, setProvider] = useState();
  const [Price, setPrice] = useState(0.012);
  const [Supply, setSupply] = useState(999);
  const [Minted, setMinted] = useState(0);
  const [MaxPerWallet, setMaxperWallet] = useState(1);
  const [UserMinted, setUserMinted] = useState(0);
  const [Presale, setPresale] = useState(true);
  const [Paused, setPaused] = useState(false);
  const ContractAddress = "0x614f969742B2e26b0265Ac13Ec788769735a24BF";
  const ChainID = {network: "Gorli", ID: 5};


  const connect = async () => {
    const web3Modal = new Web3Modal({
      network: "mainnet", // optional
      cacheProvider: false, // optional
      providerOptions,
      theme: 'dark'
    });
      try {
        toast.loading("Connecting...")
        const instance = await web3Modal.connect();
        setProvider(instance);
        const provider = new ethers.providers.Web3Provider(instance);
        const signer = await provider.getSigner();
        const account = await provider.listAccounts();
        const network = await provider.getNetwork();
        if(network.chainId !== Number(ChainID.ID)) {
          toast.dismiss();
          toast.error(`Wrong Network\n Please Change Network to ${ChainID.network}`)
          return
        };
        const CT = new ethers.Contract(ContractAddress, ABI, signer);
        setContract(CT);
        const supply = await CT.maxSupply();
        setSupply(Number(supply));
        const minted = await CT.totalSupply();
        setMinted(Number(minted))
        const price = await CT.cost();
        setPrice(Number(price));
        const perwallet = await CT.MaxperWallet();
        setMaxperWallet(Number(perwallet));
        const userminted = await CT.numberMinted(account[0]);
        setUserMinted(Number(userminted));
        const presale = await CT.preSale();
        setPresale(presale);
        const pause = await CT.paused();
        setPaused(pause);
        setaddress(account[0])
        setisConnected(true);
        toast.dismiss();
        toast.success(`Connected to ${provider.connection.url === 'metamask' ? "MetaMask" : "Wallet Connect"}`);
      } catch (err) {
        toast.dismiss();
        toast.error(err.message);
        console.log(err)
      }
  };

  const disconnect = () => {
    setaddress();
    setisConnected(false);
  };


  const PresaleMint = async(Token) => {
    if(Paused) {
      toast.dismiss();
      toast.error("Contract is Paused...");
      return
    };
    if(hexProof.length <= 0) {
      toast.dismiss();
      toast.error("You are not Whitelisted...");
      return
    };
    if(Number(Minted) >= Number(Supply)) {
      toast.dismiss();
      toast.success("SOLD OUT");
      return
    };
    try {
      toast.loading("Minting...");
      let price = String(Token * Price);
      const mint = await Contract.presalemint(Token, hexProof, {
        from: address,
        gasLimit: 115000,
        value: price
      });
      const TX = await mint.wait().then(async(receipt) => {
        toast.dismiss();
        toast.success("Mint done");
        const minted = await Contract.totalSupply();
        setMinted(Number(minted))
        const userminted = await Contract.numberMinted(account[0]);
        setUserMinted(Number(userminted));
      })
    } catch (err) {
      toast.dismiss();
      toast.error(err.message);
    }
  };


  const Mint = async(Token) => {
    if(Paused) {
      toast.dismiss();
      toast.error("Contract is Paused...");
      return
    };
    if(Number(Minted) >= Number(Supply)) {
      toast.dismiss();
      toast.success("SOLD OUT");
      return
    };
    try {
      toast.loading("Minting...");
      let price = String(Token * Price);
      const mint = await Contract.mint(Token, {
        from: address,
        gasLimit: 115000,
        value: price
      });
      const TX = await mint.wait().then(async(receipt) => {
        toast.dismiss();
        toast.success("Mint done");
        const minted = await Contract.totalSupply();
        setMinted(Number(minted))
        const userminted = await Contract.numberMinted(account[0]);
        setUserMinted(Number(userminted));
      })
    } catch (err) {
      toast.dismiss();
      toast.error(err.message);
    }
  };


    //Whitelist Setup
    const { MerkleTree } = require('merkletreejs');
    const keccak256 = require('keccak256');
    const [WlAddresses, setWlAddresses] = useState([]);
    const leafNodes = WlAddresses.map(addr => keccak256(addr));
    const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true});
    const rootHash = merkleTree.getRoot();
    console.log("Root Hash: ", '0x' + rootHash.toString('hex'));
    const claimingAddress = keccak256(address);
    const hexProof = merkleTree.getHexProof(claimingAddress);
    //Whitelist ends


  const GetWhitelistAccs = async() => {
    const Addresses = await fetch("/Whitelist/Accounts.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const FullAddresses = await Addresses.json();
    setWlAddresses(FullAddresses);
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

  useEffect(() => {
    GetWhitelistAccs();
  }, []);

  return (
    <EthersContext.Provider value={{ connect, disconnect, Mint, PresaleMint, address, isConnected, Supply, Minted }}>
      {children}
    </EthersContext.Provider>
  );
}
