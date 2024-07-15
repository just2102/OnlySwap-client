import { TokenRaw } from "./types";

export async function queryTokensList(chainId: number): Promise<TokenRaw[]> {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/external/tokensList/${chainId}`);
    const tokenList = await response.json();

    return tokenList;
  } catch (err) {
    throw err;
  }
}
