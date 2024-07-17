import { useCallback, useState } from "react";

import { Drawer } from "@mui/material";
import NativeBalance from "src/shared/components/NativeBalance";
import { truncateAddress } from "src/shared/utils/address";
import { useAccount } from "wagmi";

import Activity from "./Activity";
import styles from "./Profile.module.scss";

import DisconnectWallet from "../Connection/DisconnectWallet";

const Profile = () => {
  const { address, status } = useAccount();

  const [showActivity, setShowActivity] = useState(false);

  const onActivityToggle = useCallback(() => {
    setShowActivity((prev) => !prev);
  }, []);

  if (status === "connecting") return <div>Connecting...</div>;

  return (
    <>
      <div className={styles.profile}>
        <button
          className={styles.profileButton}
          onClick={onActivityToggle}
        >
          {truncateAddress(address)}
        </button>
      </div>

      <Drawer
        anchor='right'
        open={showActivity}
        onClose={onActivityToggle}
      >
        <div className={styles.drawerContent}>
          <DisconnectWallet />
          <NativeBalance />
          <Activity />
        </div>
      </Drawer>
    </>
  );
};

export default Profile;
