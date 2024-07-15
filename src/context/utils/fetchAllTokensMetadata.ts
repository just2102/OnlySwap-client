import { queryTokensMetadata } from "src/shared/queries/queryTokenMetadata";
import { TokenRaw } from "src/shared/queries/types";

export async function fetchAllTokensMetadata(tokens: TokenRaw[], chainId: number, batchSize: number) {
  const batches = [];
  for (let i = 0; i < tokens.length; i += batchSize) {
    const batch = tokens.slice(i, i + batchSize).map((token) => token.address);
    batches.push(batch);
  }

  const allTokensWithMetadata = [];
  for (const batch of batches) {
    const tokensWithMetadata = await queryTokensMetadata(batch, chainId);
    allTokensWithMetadata.push(...tokensWithMetadata);
  }

  return allTokensWithMetadata;
}
