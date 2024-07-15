import Profile from "src/pages/Main/widgets/HeaderWidget/features/Profile";
import { useAccount } from "wagmi";

import ConnectWallet from "./features/Connection/ConnectWallet";
import styles from "./HeaderWidget.module.scss";

const HeaderWidget = () => {
  const { isConnected } = useAccount();

  return <header className={styles.header}>{isConnected ? <Profile /> : <ConnectWallet />}</header>;
};

export default HeaderWidget;
