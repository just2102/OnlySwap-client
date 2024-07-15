import { useCallback, useContext, useState } from "react";

import { Drawer } from "@mui/material";
import { SwapContext } from "src/context/SwapContext";
import { truncateAddress } from "src/shared/utils/address";
import { useAccount } from "wagmi";

import Activity from "./Activity";
import styles from "./Profile.module.scss";

import DisconnectWallet from "../Connection/DisconnectWallet";

const Profile = () => {
  const { address, status, chain } = useAccount();
  const { nativeBalanceReadable } = useContext(SwapContext);
  const [showActivity, setShowActivity] = useState(false);

  const onActivityToggle = useCallback(() => {
    setShowActivity((prev) => !prev);
  }, []);

  if (status === "connecting") return <div>Connecting...</div>;

  return (
    <>
      <div>
        <button
          className={styles.button}
          onClick={onActivityToggle}
        >
          {truncateAddress(address)}
        </button>

        <div className={styles.balance}>
          {nativeBalanceReadable} {chain?.nativeCurrency.symbol}
        </div>
      </div>

      <Drawer
        anchor='right'
        open={showActivity}
        onClose={onActivityToggle}
      >
        <div className={styles.drawerContent}>
          <DisconnectWallet />
          <Activity />
        </div>
      </Drawer>
    </>
  );
};

export default Profile;
