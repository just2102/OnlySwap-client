import { useEffect, useState } from "react";

import ExternalLinkWithIcon from "src/shared/components/ExternalLinkWithIcon";
import { TokenWithMetadata } from "src/shared/queries/types";
import { useAccount } from "wagmi";

import styles from "./Coin.module.scss";

interface CoinProps {
  token: TokenWithMetadata;

  handleClick: (token: TokenWithMetadata) => void;
}

const Coin = ({ token, handleClick }: CoinProps) => {
  const { chain } = useAccount();

  const [explorer, setExplorer] = useState<string | undefined>(undefined);

  useEffect(() => {
    const handleExplorerChange = () => {
      if (!chain) return;
      if (!chain.blockExplorers) return "";

      const explorer = chain.blockExplorers;

      setExplorer(`${explorer.default.url}/address/${token.address}`);
    };

    handleExplorerChange();
  }, [chain, token.address]);

  return (
    <div className={styles.coin}>
      <button
        key={token.address}
        onClick={() => handleClick(token)}
        className={styles.coinButton}
      >
        <img
          className={styles.coinLogo}
          src={token.logo}
          alt={token.name}
        />
        <div className={styles.nameAndSymbol}>
          <span className={styles.name}>{token.name}</span>
          <div className={styles.symbolAndLink}>
            <span className={styles.symbol}>{token.symbol}</span>
            <ExternalLinkWithIcon link={explorer} />
          </div>
        </div>
      </button>
    </div>
  );
};

export default Coin;
