import { StoredTx } from "./types";

export function getTxs() {
  const txs = localStorage.getItem("transactions");

  if (!txs) {
    return [];
  }

  return JSON.parse(txs) as StoredTx[];
}
