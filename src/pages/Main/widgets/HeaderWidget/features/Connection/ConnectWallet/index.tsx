import { useMemo, useState } from "react";

import CustomModal from "src/shared/components/CustomModal";
import { Connector, useConnect } from "wagmi";

import styles from "./ConnectWallet.module.scss";

const allowedConnectors = ["WalletConnect", "MetaMask", "Pontem Wallet"];

const ConnectWallet = () => {
  const { connectors, connect } = useConnect();
  const [isModalOpen, setModalOpen] = useState(false);

  const handleConnectClick = (connector: Connector) => {
    connect({ connector });
    setModalOpen(false);
  };
  console.log("connectors: ", connectors);

  const filteredAndSortedConnectors = useMemo(() => {
    return connectors
      .filter((connector) => allowedConnectors.includes(connector.name))
      .sort((a, b) => (a.name === "WalletConnect" ? 1 : b.name === "WalletConnect" ? -1 : 0));
  }, [connectors]);

  return (
    <div className={styles.connectWallet}>
      <button
        className={styles.openModal}
        onClick={() => setModalOpen(true)}
      >
        Connect
      </button>
      <CustomModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        header='Connect to a wallet'
      >
        <div className={styles.connectors}>
          {filteredAndSortedConnectors.map((connector) => (
            <button
              className={styles.connector}
              key={connector.uid}
              onClick={() => handleConnectClick(connector)}
            >
              {connector.name}
              {connector.icon && (
                <img
                  src={connector.icon}
                  alt={connector.name}
                />
              )}
            </button>
          ))}
        </div>
      </CustomModal>
    </div>
  );
};
export default ConnectWallet;
