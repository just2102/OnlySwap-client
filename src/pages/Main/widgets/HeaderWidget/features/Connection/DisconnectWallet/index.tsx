import { truncateAddress } from "src/shared/utils/address";
import { useAccount, useDisconnect } from "wagmi";

import styles from "./DisconnectWallet.module.scss";

const DisconnectWallet = () => {
  const { disconnect } = useDisconnect();
  const { address } = useAccount();

  return (
    <div className={styles.disconnectWallet}>
      <span className={styles.address}>{truncateAddress(address)}</span>
      <button
        className={styles.disconnectButton}
        onClick={() => disconnect()}
      >
        Disconnect
      </button>
    </div>
  );
};

export default DisconnectWallet;
