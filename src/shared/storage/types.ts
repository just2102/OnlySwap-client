export type StoredTx = {
  hash: string;
  fromToken: StoredTxToken;
  toToken: StoredTxToken;
  fromAmount: string;
  toAmount: string;

  feeAmount: string;
  feeTokenSymbol: string;
};

type StoredTxToken = {
  address: string;
  symbol: string;
  name: string;
  logoURI: string;
};
