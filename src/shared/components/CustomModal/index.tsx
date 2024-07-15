import React from "react";

import styles from "./CustomModal.module.scss";

interface CustomModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  header: string;
}

const CustomModal = ({ children, isOpen, onClose, header }: CustomModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className={styles.modalOverlay}
      onClick={onClose}
    >
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className={styles.closeButton}
          onClick={onClose}
        >
          ×
        </button>
        <div className={styles.header}>
          <h2>{header}</h2>
        </div>

        {children}
      </div>
    </div>
  );
};

export default CustomModal;
