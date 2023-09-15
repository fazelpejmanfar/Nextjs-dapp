import "@rainbow-me/rainbowkit/styles.css";
import {
  RainbowKitProvider,
  useConnectModal,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { mainnet, goerli } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { infuraProvider } from "wagmi/providers/infura";
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
  bitskiWallet,
} from "@rainbow-me/rainbowkit/wallets";
import {
  contractChainId,
  infuraApiKey,
  projectId,
  CollectionName,
} from "../lib/constants";

export default function Web3Providers({ children }) {
  const { chains, publicClient } = configureChains(
    [goerli, mainnet],
    [infuraProvider({ apiKey: infuraApiKey }), publicProvider()]
  );

  const connectors = connectorsForWallets([
    {
      groupName: "Popular",
      wallets: [
        injectedWallet({ chains }),
        metaMaskWallet({ projectId, chains }),
        trustWallet({ chains, projectId }),
        coinbaseWallet({ projectId, chains }),
      ],
    },
    {
      groupName: "More",
      wallets: [
        walletConnectWallet({ projectId, chains }),
        rainbowWallet({ projectId, chains }),
        argentWallet({ projectId, chains }),
        safeWallet({ chains }),
        dawnWallet({ chains }),
        phantomWallet({ chains }),
        okxWallet({ projectId, chains }),
        ledgerWallet({ projectId, chains }),
        braveWallet({ chains }),
        bitskiWallet({ chains }),
      ],
    },
  ]);

  const wagmiConfig = createConfig({
    autoConnect: false,
    connectors,
    publicClient,
  });

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        chains={chains}
        coolMode
        appInfo={{
          appName: CollectionName,
        }}
        initialChain={contractChainId == 5 ? goerli : mainnet}
      >
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
