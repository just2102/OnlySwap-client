import { createWalletClient, custom } from "viem";
import { http, createConfig } from "wagmi";
import { mainnet, sepolia, localhost } from "wagmi/chains";
import { walletConnect } from "wagmi/connectors";

declare module "wagmi" {
  interface Register {
    config: typeof wagmiConfig;
  }
}

const projectId = "79c3184990ccb77da0b3e65dc9838a1e";

export const wagmiConfig = createConfig({
  chains: [localhost, mainnet, sepolia],
  connectors: [walletConnect({ projectId })],
  transports: {
    [localhost.id]: http(),
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

interface UniswapConfig {
  rpc: {
    local: string;
    mainnet: string;
  };
}

export const uniswapConfig: UniswapConfig = {
  rpc: {
    local: "http://localhost:8545",
    mainnet: "",
  },
};

/**
 * This walletClient can be used both for localhost and other networks.
 * (alt. to using wagmi hooks to send & simulate TXs which don't work with localhost)
 */
export const walletClient = createWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum!),
});
