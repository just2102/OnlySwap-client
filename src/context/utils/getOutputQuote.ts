import { CurrencyAmount, Token, TradeType } from "@uniswap/sdk-core";
import Quoter from "@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json";
import { FeeAmount, Route, SwapQuoter } from "@uniswap/v3-sdk";
import { wagmiConfig } from "src/shared/data/config";
import { getQuoterAddress } from "src/shared/utils/address";
import { simulateContract } from "wagmi/actions";

export async function getOutputQuote(
  chainId: number | undefined,
  swapRoute: Route<Token, Token>,
  fromToken: Token,
  toToken: Token,
  fee: FeeAmount,
  parsedFromAmount: string,
  tradeType: TradeType,
) {
  try {
    const { calldata } = SwapQuoter.quoteCallParameters(swapRoute, CurrencyAmount.fromRawAmount(fromToken, parsedFromAmount), tradeType, {
      useQuoterV2: true,
    });
    if (!calldata) throw new Error("Failed to get quote: no calldata");

    const quoteCallReturnData = await simulateContract(wagmiConfig, {
      abi: Quoter.abi,
      functionName: "quoteExactInputSingle",
      address: getQuoterAddress(chainId),
      args: [fromToken.address, toToken.address, fee, parsedFromAmount, 0],
    });

    return quoteCallReturnData.result as bigint;
  } catch (err) {
    throw new Error(`Failed to get quote: ${err}`);
  }
}
