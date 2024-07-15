import { TokenWithMetadata } from "./types";

export async function queryTokensMetadata(tokens: string[], chainId: number): Promise<TokenWithMetadata[]> {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/moralis/queryTokensMetadata`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tokens, chainId }),
    });

    return response.json();
  } catch (error) {
    throw error;
  }
}
