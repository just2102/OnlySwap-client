import { useCallback, useContext, useEffect, useRef, useState } from "react";

import { Alert, Snackbar } from "@mui/material";
import { SwapContext } from "src/context/SwapContext";
import { useBlockNumber } from "wagmi";

import InputGroup from "./features/InputGroup";
import SwapInfoModal from "./features/SwapInfoModal";
import styles from "./SwapWidget.module.scss";

const SwapWidget = () => {
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    amountIn,
    amountOut,
    fromToken,
    toToken,
    handleFromTokenChange,
    handleToTokenChange,
    handleAmountInChange,
    handleAmountOutChange,
    getQuote,
    handleSwap,
    interactionDisabled,
  } = useContext(SwapContext);

  const prevFromToken = useRef(fromToken);
  const prevToToken = useRef(toToken);
  const prevAmountIn = useRef(amountIn);

  const handleSwapButtonClick = useCallback(() => {
    setInfoModalOpen(true);
    handleSwap().catch((err) => {
      setError(err);
      console.error(err);
    });
  }, [handleSwap]);

  const handleModalClose = useCallback(() => {
    setError(null);
    setInfoModalOpen(false);
  }, []);

  useEffect(() => {
    const refetchQuote = async () => {
      setError(null);

      try {
        await getQuote();
      } catch (err) {
        if (typeof err === "string") {
          setError(err);
        }
        console.error(err);
      }
    };

    if (
      blockNumber &&
      (fromToken.address !== prevFromToken.current.address ||
        toToken.address !== prevToToken.current.address ||
        amountIn !== prevAmountIn.current)
    ) {
      refetchQuote();
      prevFromToken.current = fromToken;
      prevToToken.current = toToken;
      prevAmountIn.current = amountIn;
    }
  }, [blockNumber, getQuote, amountIn, fromToken, toToken]);

  return (
    <div className={styles.widget}>
      <InputGroup
        token={fromToken}
        handleTokenChange={handleFromTokenChange}
        amount={amountIn}
        handleAmountChange={handleAmountInChange}
      />
      <InputGroup
        token={toToken}
        handleTokenChange={handleToTokenChange}
        amount={amountOut}
        handleAmountChange={handleAmountOutChange}
      />

      <button
        onClick={handleSwapButtonClick}
        disabled={interactionDisabled}
      >
        Swap
      </button>

      <SwapInfoModal
        isOpen={infoModalOpen}
        onClose={handleModalClose}
        error={error}
      />

      <Snackbar
        open={error !== null}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity='error'>{error?.toString()}</Alert>
      </Snackbar>
    </div>
  );
};

export default SwapWidget;
