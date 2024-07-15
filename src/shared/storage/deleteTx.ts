import { getTxs } from "./getTxs";

export async function deleteTx(hash: string) {
  const txs = getTxs();

  const updatedTransactions = txs.filter((tx) => tx.hash !== hash);

  localStorage.setItem("transactions", JSON.stringify(updatedTransactions));
}
