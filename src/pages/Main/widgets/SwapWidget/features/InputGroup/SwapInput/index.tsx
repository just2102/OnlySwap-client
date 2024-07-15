import InputNumber from "src/shared/components/InputNumber";

import styles from "./SwapInput.module.scss";

interface SwapInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const SwapInput = ({ value, onChange, disabled }: SwapInputProps) => {
  return (
    <div className={styles.swapInput}>
      <InputNumber
        onChange={onChange}
        value={value}
        disabled={disabled}
      />
    </div>
  );
};

export default SwapInput;
