import { Abi } from "viem";

import { TokenWithMetadata } from "../queries/types";

export enum SupportedNetworks {
  Ethereum = "Ethereum",
  Polygon = "Polygon",
}

export const chainsRpcs = {
  [SupportedNetworks.Ethereum]: "https://mainnet.infura.io/v3/0ac57a06f2994538829c14745750d721",
  [SupportedNetworks.Polygon]: "https://rpc-mainnet.matic.network",
};

export const ETH_DECIMALS_DEFAULT = 18;
export const DEFAULT_PRECISION = 6;

export const WETH_TOKEN: TokenWithMetadata = {
  address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
  address_label: "Wrapped Ether",
  name: "Wrapped Ether",
  symbol: "WETH",
  decimals: "18",
  logo: "https://logo.moralis.io/0x1_0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2_018112a9229b4bf1bf0d042beb7c2c55",
  logo_hash: "0a7fc292596820fe066ce8ce3fd6e2ad9d479c2993f905e410ef74f2062a83ec",
  thumbnail: "https://logo.moralis.io/0x1_0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2_018112a9229b4bf1bf0d042beb7c2c55",
  total_supply: "2925164800328939194383388",
  total_supply_formatted: "2925164.800328939194383388",
  fully_diluted_valuation: "11210654240.60",
  block_number: "19917914",
  validated: 1,
  created_at: "2017-12-12T11:17:35.000Z",
  possible_spam: false,
  verified_contract: true,
  categories: [],
  links: {
    website: "https://weth.io/",
    reddit: "https://www.reddit.com",
  },
};
export const USDC_TOKEN: TokenWithMetadata = {
  address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  address_label: "USD Coin (USDC)",
  name: "USD Coin",
  symbol: "USDC",
  decimals: "6",
  logo: "https://logo.moralis.io/0x1_0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48_e6ec22e3ef954a7f9eda04f294938f4d",
  logo_hash: "442b80bd16af0c0d9b22e03a16753823fe826e5bfd457292b55fa0ba8c1ba213",
  thumbnail: "https://logo.moralis.io/0x1_0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48_e6ec22e3ef954a7f9eda04f294938f4d",
  total_supply: "24221769693859384",
  total_supply_formatted: "24221769693.859384",
  fully_diluted_valuation: "24253508533.36",
  block_number: "19969341",
  validated: 1,
  created_at: "2018-08-03T19:28:24.000Z",
  possible_spam: false,
  verified_contract: true,
  categories: ["Exchange-Issued Asset Tokens", "Platform-Based Utility Tokens", "Stablecoins"],
  links: {
    twitter: "https://twitter.com/circle",
    website: "https://www.circle.com/en/usdc",
    medium: "https://medium.com/centre-blog",
    github: "https://github.com/centrehq/centre-tokens",
    reddit: "https://www.reddit.com",
    discord: "https://discord.com/invite/buildoncircle",
  },
};

export const WETH_CONTRACT_ADDRESS = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";

export const SWAP_ROUTER_01_ADDRESS = "0xE592427A0AEce92De3Edee1F18E0157C05861564";

export const WETH_ABI: Abi = [
  {
    constant: false,
    inputs: [],
    name: "deposit",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "wad",
        type: "uint256",
      },
    ],
    name: "withdraw",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
];

export const MAX_FEE_PER_GAS = 100000000000;
export const MAX_PRIORITY_FEE_PER_GAS = 100000000000;

// todo: fill in data for other tokens
// allowed tokens: [USDC, USDT, DAI, WETH, ETH]
// todo: handle ETH differently, because we cannot directly swap ETH to another coin. first it should be wrapped.
