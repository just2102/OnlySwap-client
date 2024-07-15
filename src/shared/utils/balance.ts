import { DEFAULT_PRECISION, ETH_DECIMALS_DEFAULT } from "src/shared/data/const";
import { formatUnits, parseUnits } from "viem";

export function formatBalance(balance: bigint | undefined, decimals?: number | string, precision?: number) {
  if (!balance) return "0";

  const decimalsToUse = decimals ? Number(decimals) : ETH_DECIMALS_DEFAULT;

  const formatted = parseFloat(formatUnits(balance, decimalsToUse));

  if (!precision) {
    return formatted.toFixed(DEFAULT_PRECISION);
  } else {
    return formatted.toFixed(precision);
  }
}

export function fromReadableAmount(amount: number | string, decimals: number) {
  if (typeof amount === "string") {
    return parseUnits(amount, decimals);
  }

  return parseUnits(amount.toString(), decimals);
}
