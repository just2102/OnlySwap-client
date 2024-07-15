import { getBackendUrl } from "./const";
import { TokenRaw } from "./types";

export async function queryTokensList(chainId: number): Promise<TokenRaw[]> {
  try {
    const response = await fetch(`${getBackendUrl()}/external/tokensList/${chainId}`);
    const tokenList = await response.json();

    return tokenList;
  } catch (err) {
    throw err;
  }
}
