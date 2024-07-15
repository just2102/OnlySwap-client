import { erc20Abi } from "viem";
import { useAccount, useReadContracts } from "wagmi";

import { TokenWithMetadata } from "../queries/types";

const useCoinBalance = (token: TokenWithMetadata) => {
  const { address } = useAccount();

  const contract = {
    address: token.address,
    abi: erc20Abi,
  } as const;

  const result = useReadContracts({
    contracts: [
      {
        ...contract,
        functionName: "balanceOf",
        args: [address!],
      },
    ],
  });

  return result;
};

export default useCoinBalance;
