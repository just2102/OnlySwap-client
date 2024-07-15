import { useContext } from "react";

import { SwapContext } from "src/context/SwapContext";
import CustomModal from "src/shared/components/CustomModal";
import ErrorAlert from "src/shared/components/ErrorAlert";
import { truncateAddress } from "src/shared/utils/address";

import styles from "./SwapInfoModal.module.scss";
import SwapStep from "./SwapStep";

interface SwapInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  error: string | null;
}

const SwapInfoModal = ({ isOpen, onClose, error }: SwapInfoModalProps) => {
  const { isApproved, swapSuccessTx, isWrapping, wrapSuccess } = useContext(SwapContext);

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      header='Confirm Swap'
    >
      <div className={styles.infoModalContent}>
        {error ? (
          <ErrorAlert />
        ) : (
          <>
            {isWrapping && (
              <SwapStep
                stepNumber={1}
                isCompleted={wrapSuccess}
                isActive={true}
                description='Wrap ETH to WETH'
                isLoading={!wrapSuccess}
              />
            )}

            <SwapStep
              stepNumber={isWrapping ? 2 : 1}
              isCompleted={isApproved}
              isActive={!isWrapping}
              description='Approve the app to spend your tokens'
              link='https://support.metamask.io/transactions-and-gas/transactions/what-is-a-token-approval'
              isLoading={!isApproved && !isWrapping}
            />

            <SwapStep
              stepNumber={isWrapping ? 3 : 2}
              isCompleted={!!swapSuccessTx}
              isActive={isApproved}
              description='Confirm the swap in your wallet'
              isLoading={isApproved && !swapSuccessTx}
            />

            {swapSuccessTx && (
              <div className={styles.txSuccess}>
                <h4>Swap Successful!</h4>
                <a href='/'>View transaction {truncateAddress(swapSuccessTx)}</a>
              </div>
            )}
          </>
        )}
      </div>
    </CustomModal>
  );
};

export default SwapInfoModal;
