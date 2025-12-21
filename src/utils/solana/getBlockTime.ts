import { ParsedTransactionWithMeta } from '@solana/web3.js';

export function getBlockTime(
  parsedTransactionWithMeta: ParsedTransactionWithMeta
) {
  return parsedTransactionWithMeta.blockTime;
}
