import { Skeleton } from "@mui/material";
import useCoinBalance from "src/shared/hooks/useCoinBalance";
import { TokenWithMetadata } from "src/shared/queries/types";
import { formatBalance } from "src/shared/utils/balance";

import styles from "./CoinBalance.module.scss";

interface CoinBalanceProps {
  coin: TokenWithMetadata;
}

const CoinBalance = ({ coin }: CoinBalanceProps) => {
  const coinBalance = useCoinBalance(coin);

  return (
    <div className={styles.coinBalance}>
      {coinBalance.isPending ? (
        <Skeleton
          variant='text'
          animation='wave'
          sx={{
            marginLeft: "auto",
          }}
          width={60}
        />
      ) : (
        <span>{formatBalance(coinBalance.data?.[0].result, coin.decimals, 4)} </span>
      )}
    </div>
  );
};

export default CoinBalance;
