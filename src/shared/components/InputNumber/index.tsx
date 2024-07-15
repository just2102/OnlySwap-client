import styles from "./InputNumber.module.scss";

interface InputNumberProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  decimalPlaces?: number;
  max?: number;
  min?: number;
}

const InputNumber = ({ value, onChange, disabled, className, decimalPlaces = 18, max, min }: InputNumberProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    /** Only valid decimal numbers */
    const regex = new RegExp(`^\\d*(\\.\\d{0,${decimalPlaces}})?$`);

    if (
      (regex.test(newValue) || newValue === "") &&
      (max === undefined || parseFloat(newValue) <= max) &&
      (min === undefined || parseFloat(newValue) >= min)
    ) {
      onChange(newValue);
    }
  };

  return (
    <input
      type='text'
      value={value}
      onChange={handleChange}
      disabled={disabled}
      className={`${styles.inputNumber} ${className ? className : ""}`}
      placeholder='0'
    />
  );
};

export default InputNumber;
