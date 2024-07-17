import { useContext } from "react";

import { SwapContext } from "src/context/SwapContext";
import { useAccount } from "wagmi";

import styles from "./SwapButton.module.scss";

interface SwapButtonProps {
  handleClick: () => void;
}

const SwapButton = ({ handleClick }: SwapButtonProps) => {
  const { isConnected } = useAccount();

  const { interactionDisabled } = useContext(SwapContext);

  const disabled = interactionDisabled || !isConnected;

  const text = () => {
    if (!isConnected) {
      return "Connect Wallet";
    }

    return "Swap";
  };

  return (
    <button
      className={styles.swapButton}
      onClick={handleClick}
      disabled={disabled}
    >
      {text()}
    </button>
  );
};

export default SwapButton;
