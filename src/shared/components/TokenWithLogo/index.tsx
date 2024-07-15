import styles from "./TokenWithLogo.module.scss";

interface TokenWithLogoProps {
  symbol: string;
  logo: string;
  className?: string;
}

const TokenWithLogo = ({ symbol, logo, className }: TokenWithLogoProps) => {
  return (
    <div className={`${styles.tokenWithLogo} ${className ? className : ""}`}>
      <img
        src={logo}
        alt={symbol}
      />
      <span>{symbol}</span>
    </div>
  );
};

export default TokenWithLogo;
