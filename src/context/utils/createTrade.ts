import { TradeType, CurrencyAmount, Token } from "@uniswap/sdk-core";
import { FeeAmount, Pool, Route, Trade } from "@uniswap/v3-sdk";
import { fromReadableAmount } from "src/shared/utils/balance";
import { Client } from "viem";

import { getOutputQuote } from "./getOutputQuote";
import { getPoolInfo } from "./getPoolInfo";

export async function createTrade(client: Client, chainId: number, fromToken: Token, toToken: Token, poolFee: FeeAmount, amountIn: string) {
  const poolInfo = await getPoolInfo(client, chainId, fromToken, toToken, poolFee);

  const pool = new Pool(fromToken, toToken, poolFee, poolInfo.sqrtPriceX96.toString(), poolInfo.liquidity.toString(), poolInfo.tick);

  const swapRoute = new Route([pool], fromToken, toToken);

  const outputQuote = await getOutputQuote(
    chainId,
    swapRoute,
    fromToken,
    toToken,
    pool.fee,
    fromReadableAmount(amountIn, fromToken.decimals).toString(),
    TradeType.EXACT_INPUT,
  );

  const inputRawAmount = fromReadableAmount(amountIn, fromToken.decimals);
  const inputAmount = CurrencyAmount.fromRawAmount(fromToken, inputRawAmount.toString());
  const outputAmount = CurrencyAmount.fromRawAmount(toToken, outputQuote.toString());

  const uncheckedTrade = Trade.createUncheckedTrade({
    route: swapRoute,
    inputAmount: inputAmount,
    outputAmount: outputAmount,
    tradeType: TradeType.EXACT_INPUT,
  });

  return uncheckedTrade;
}
