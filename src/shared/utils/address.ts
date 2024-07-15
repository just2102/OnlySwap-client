import { QUOTER_ADDRESSES, SWAP_ROUTER_02_ADDRESSES, V3_CORE_FACTORY_ADDRESSES } from "@uniswap/sdk-core";

import { SWAP_ROUTER_01_ADDRESS } from "../data/const";

export function truncateAddress(address: `0x${string}` | undefined, startLength = 6, endLength = 4) {
  if (!address) return;

  const start = address.substring(0, startLength);
  const end = address.substring(address.length - endLength);

  return `${start}...${end}`;
}

export function getQuoterAddress(chainId: number | undefined) {
  if (!chainId) {
    throw new Error("ChainId is not defined");
  }

  const quoterAddress = QUOTER_ADDRESSES[chainId];

  if (!quoterAddress) {
    throw new Error(`Quoter address not found for chainId: ${chainId}`);
  }

  return quoterAddress as `0x${string}`;
}

export function getFactoryAddress(chainId: number | undefined) {
  if (!chainId) {
    throw new Error("ChainId is not defined");
  }

  const factoryAddress = V3_CORE_FACTORY_ADDRESSES[chainId];

  if (!factoryAddress) {
    throw new Error(`Factory address not found for chainId: ${chainId}`);
  }

  return factoryAddress as `0x${string}`;
}

export function getSwapRouterAddress(chainId: number | undefined) {
  if (!chainId) {
    throw new Error("ChainId is not defined");
  }

  const swapRouterAddress = SWAP_ROUTER_02_ADDRESSES(chainId);

  if (!swapRouterAddress) {
    throw new Error(`Swap router address not found for chainId: ${chainId}`);
  }

  return SWAP_ROUTER_01_ADDRESS; // todo: sdk prepares data for old router (https://github.com/Uniswap/sdks/issues/28)

  return swapRouterAddress as `0x${string}`;
}
