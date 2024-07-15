import CoinBalance from "src/shared/components/CoinBalance";
import { TokenWithMetadata } from "src/shared/queries/types";

import CoinSelect from "./CoinSelect";
import styles from "./InputGroup.module.scss";
import SwapInput from "./SwapInput";

interface InputGroupProps {
  token: TokenWithMetadata;
  handleTokenChange: (token: TokenWithMetadata) => void;

  amount: string;
  handleAmountChange: (amount: string) => void;
}

const InputGroup = ({ token, handleTokenChange, amount, handleAmountChange }: InputGroupProps) => {
  return (
    <div className={styles.inputGroup}>
      <CoinSelect
        selectedCoin={token}
        handleTokenChange={handleTokenChange}
      />
      <div className={styles.inputWithBalance}>
        <SwapInput
          value={amount}
          onChange={handleAmountChange}
        />
        <CoinBalance coin={token} />
      </div>
    </div>
  );
};

export default InputGroup;
