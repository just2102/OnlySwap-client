import { TokenWithMetadata } from "src/shared/queries/types";

import { getTxs } from "./getTxs";
import { StoredTx } from "./types";

export async function storeTx(
  hash: string,
  fromToken: TokenWithMetadata,
  toToken: TokenWithMetadata,
  fromAmount: string,
  toAmount: string,
  feeAmount: string,
  feeTokenSymbol: string,
) {
  const tx: StoredTx = {
    hash,
    feeAmount,
    feeTokenSymbol,
    fromAmount,
    toAmount,

    fromToken: {
      address: fromToken.address,
      logoURI: fromToken.logo,
      name: fromToken.name,
      symbol: fromToken.symbol,
    },
    toToken: {
      address: toToken.address,
      logoURI: toToken.logo,
      name: toToken.name,
      symbol: toToken.symbol,
    },
  };

  const transactions = getTxs();
  transactions.push(tx);

  localStorage.setItem("transactions", JSON.stringify(transactions));
}
