import { DEFAULT_PRECISION } from "src/shared/data/const";
import useNativeBalance from "src/shared/hooks/useNativeBalance";
import { useAccount } from "wagmi";

import styles from "./NativeBalance.module.scss";

const NativeBalance = () => {
  const { chain } = useAccount();
  const { nativeBalanceReadable } = useNativeBalance();

  if (!nativeBalanceReadable) return null;

  return (
    <div className={styles.balance}>
      {parseFloat(nativeBalanceReadable).toFixed(DEFAULT_PRECISION)} {chain?.nativeCurrency.symbol}
    </div>
  );
};

export default NativeBalance;
