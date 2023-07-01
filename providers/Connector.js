import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultWallets,
  RainbowKitProvider,
  useConnectModal,
} from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { mainnet, goerli } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { projectId, CollectionName } from "../lib/constants";

export default function Web3Providers({ children }) {
  const { chains, publicClient } = configureChains(
    [goerli],
    [publicProvider()]
  );

  const { connectors } = getDefaultWallets({
    appName: CollectionName,
    projectId: projectId,
    chains,
  });

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
