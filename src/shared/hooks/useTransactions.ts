import { useState, useEffect, useCallback } from "react";

import { getTxs } from "../storage/getTxs";
import { StoredTx } from "../storage/types";

const useTransactions = () => {
  const [transactions, setTransactions] = useState<StoredTx[] | null>(null);

  const fetchTransactions = useCallback(() => {
    const storedTransactions = getTxs();
    setTransactions(storedTransactions);
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return { transactions, fetchTransactions };
};

export default useTransactions;
