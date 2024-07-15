import { Token } from "@uniswap/sdk-core";
import IUniswapV3PoolABI from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";
import { FeeAmount, computePoolAddress } from "@uniswap/v3-sdk";
import { getFactoryAddress } from "src/shared/utils/address";
import { Client, ContractFunctionExecutionError, getContract } from "viem";

export async function getPoolInfo(client: Client, chainId: number, fromToken: Token, toToken: Token, poolFee: FeeAmount) {
  try {
    const currentPoolAddress = computePoolAddress({
      factoryAddress: getFactoryAddress(chainId),
      tokenA: fromToken,
      tokenB: toToken,
      fee: poolFee,
      chainId: chainId,
    });
    console.log("currentPoolAddress", currentPoolAddress);

    const poolContract = getContract({
      abi: IUniswapV3PoolABI.abi,
      address: currentPoolAddress as `0x${string}`,
      client: client,
    });

    const [token0, token1, fee, tickSpacing, liquidity, slot0] = await Promise.all([
      poolContract.read.token0() as Promise<string>,
      poolContract.read.token1() as Promise<string>,
      poolContract.read.fee() as Promise<bigint>,
      poolContract.read.tickSpacing() as Promise<number>,
      poolContract.read.liquidity() as Promise<bigint>,
      poolContract.read.slot0() as Promise<[bigint, number]>,
    ]);

    return {
      token0,
      token1,
      fee,
      tickSpacing,
      liquidity,
      sqrtPriceX96: slot0[0],
      tick: slot0[1],
    };
  } catch (err) {
    if (err instanceof ContractFunctionExecutionError) {
      throw "Pool not found";
    }

    throw err;
  }
}
