import { useContext, useEffect, useState } from "react";

import { Skeleton } from "@mui/material";
import { SwapContext } from "src/context/SwapContext";
import CustomModal from "src/shared/components/CustomModal";
import SearchInput from "src/shared/components/SearchInput";
import { TokenWithMetadata } from "src/shared/queries/types";
import { useAccount } from "wagmi";

import Coin from "./Coin";
import styles from "./CoinSelect.module.scss";

interface CoinSelectProps {
  selectedCoin: TokenWithMetadata;
  handleTokenChange: (token: TokenWithMetadata) => void;
}

const CoinSelect = ({ selectedCoin, handleTokenChange }: CoinSelectProps) => {
  const { chainId } = useAccount();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTokens, setFilteredTokens] = useState<TokenWithMetadata[]>([]);
  const { initialDisplayedTokens } = useContext(SwapContext);

  useEffect(() => {
    if (!initialDisplayedTokens) return;
    const query = searchQuery.toLowerCase();
    const filtered = initialDisplayedTokens.filter(
      (token) => token.address.toLowerCase().includes(query) || token.symbol.toLowerCase().includes(query),
    );
    setFilteredTokens(filtered);
  }, [searchQuery, initialDisplayedTokens]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const selectCoin = (coin: TokenWithMetadata) => {
    if (!chainId) return;

    handleTokenChange(coin);
    closeModal();
  };

  return (
    <div className={styles.coinSelect}>
      <button
        onClick={openModal}
        className={styles.selectButton}
      >
        <img
          className={styles.coinImage}
          src={selectedCoin.thumbnail}
          alt={selectedCoin.symbol}
        />
        {selectedCoin.symbol}
      </button>
      <CustomModal
        isOpen={isModalOpen}
        onClose={closeModal}
        header='Choose a token'
      >
        <SearchInput
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <div className={styles.list}>
          {initialDisplayedTokens.length === 0
            ? Array.from({ length: 7 }).map((_, index) => (
                <Skeleton
                  key={index}
                  variant='rounded'
                  height={40}
                  className={styles.coinSkeleton}
                />
              ))
            : filteredTokens.map((coin) => (
                <Coin
                  key={coin.address}
                  token={coin}
                  handleClick={selectCoin}
                />
              ))}
        </div>
      </CustomModal>
    </div>
  );
};

export default CoinSelect;
