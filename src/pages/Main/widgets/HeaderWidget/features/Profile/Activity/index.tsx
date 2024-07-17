import { useCallback } from "react";

import TokenWithLogo from "src/shared/components/TokenWithLogo";
import useTransactions from "src/shared/hooks/useTransactions";
import { clearTxs } from "src/shared/storage/clearTxs";

import styles from "./Activity.module.scss";

const Activity = () => {
  const { transactions, fetchTransactions } = useTransactions();

  const handleClearTxs = useCallback(() => {
    clearTxs(fetchTransactions);
  }, [fetchTransactions]);

  return (
    <div className={styles.activity}>
      <div className={styles.header}>
        <h4>Activity</h4>
        {transactions?.length ? <button onClick={handleClearTxs}>Clear</button> : null}
      </div>
      <div className={styles.txs}>
        {transactions?.map((tx) => (
          <div
            className={styles.tx}
            key={tx.hash}
          >
            <div className={styles.tokensInfo}>
              <TokenWithLogo
                symbol={tx.fromToken.symbol}
                logo={tx.fromToken.logoURI}
              />
              <span>{tx.fromAmount}</span>

              <span>→</span>
              <TokenWithLogo
                symbol={tx.toToken.symbol}
                logo={tx.toToken.logoURI}
              />
              <span>{tx.toAmount}</span>
            </div>
            <div className={styles.feeInfo}>
              Fee: {tx.feeAmount} {tx.feeTokenSymbol}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Activity;
