import { useAccount, useBalance } from "wagmi";

const useNativeBalance = () => {
  const account = useAccount();

  const { data: nativeBalance } = useBalance({
    address: account.address,
    chainId: account.chain?.id,
  });

  return {
    nativeBalanceReadable: nativeBalance?.formatted,
  };
};

export default useNativeBalance;
