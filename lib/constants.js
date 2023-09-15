import ABI from "./abi.json";
import {
  OpenseaSVG,
  EtherscanSVG,
  TwitterSVG,
  DiscordSVG,
} from "./HeaderIcons";

export const ContractAddress = {
  address: "0x9EE4490A25C674Faa300327925b453698c413A32",
  abi: ABI,
};
export const projectId = "ea12f987ea5f2430cacb522ebb6a369a";
export const CollectionName = "Nextjs Mint dApp by Fazel";


export const HeaderItems = [
  { name: "Opensea", target: "https://twitter.com", img: <OpenseaSVG /> },
  {
    name: "Etherscan",
    target: `https://etherscan.io/address/${ContractAddress.address}}`,
    img: <EtherscanSVG />,
  },
  { name: "Twitter", target: "https://twitter.com", img: <TwitterSVG /> },
  { name: "Discord", target: "https://twitter.com", img: <DiscordSVG /> },
];
