import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultWallets,
  RainbowKitProvider,
  useConnectModal,
  connectorsForWallets 
} from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { mainnet, goerli } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { projectId, CollectionName } from "../lib/constants";
import {
  injectedWallet,
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet,
  trustWallet,
  coinbaseWallet,
  argentWallet,
  safeWallet,
  dawnWallet,
  phantomWallet,
  okxWallet,
  ledgerWallet,
  braveWallet,
  bitskiWallet
} from '@rainbow-me/rainbowkit/wallets';
export default function Web3Providers({ children }) {
  const { chains, publicClient } = configureChains(
    [goerli],
    [publicProvider()]
  );

/*   const { connectors } = getDefaultWallets({
    appName: CollectionName,
    projectId: projectId,
    chains,
  }); */

  const connectors = connectorsForWallets([
    {
      groupName: 'Popular',
      wallets: [
        injectedWallet({ chains }),
        metaMaskWallet({ projectId, chains }),
        //walletConnectWallet({ projectId, chains }),
        coinbaseWallet({ projectId, chains }),
      ],
    },
    {
      groupName: 'More',
      wallets: [
        rainbowWallet({ projectId, chains }),
        argentWallet({ projectId, chains }),
        safeWallet({ chains }),
        dawnWallet({chains }),
        phantomWallet({ chains }),
        okxWallet({ projectId, chains }),
        ledgerWallet({ projectId, chains }),
        braveWallet({ chains }),
        bitskiWallet({  chains }),
      ],
    }
  ]);

  const wagmiConfig = createConfig({
    autoConnect: false,
    connectors,
    publicClient,
  });



  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} coolMode initialChain={goerli}>
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
