export function clearTxs(callback?: () => void) {
  localStorage.removeItem("transactions");

  if (callback) {
    callback();
  }
}
