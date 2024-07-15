import { CurrencyAmount, Token } from "@uniswap/sdk-core";
import { wagmiConfig } from "src/shared/data/config";
import { getSwapRouterAddress } from "src/shared/utils/address";
import { fromReadableAmount } from "src/shared/utils/balance";
import { erc20Abi } from "viem";
import { writeContract } from "wagmi/actions";

export async function getTokenTransferApproval(account: `0x${string}`, token: Token, amount: CurrencyAmount<Token>) {
  const hash = await writeContract(wagmiConfig, {
    abi: erc20Abi,
    address: token.address as `0x${string}`,
    account: account,
    functionName: "approve",
    args: [getSwapRouterAddress(token.chainId), fromReadableAmount(amount.toFixed(), token.decimals)],
  });

  // todo: code below not work on local fork, so just wait 3 seconds
  await new Promise((resolve) => setTimeout(resolve, 3000));
  // const transactionReceipt = await waitForTransactionReceipt(wagmiConfig, {
  //   confirmations: 2,
  //   hash: hash,
  // });
  // console.log("transactionReceipt", transactionReceipt);

  return hash;
}
