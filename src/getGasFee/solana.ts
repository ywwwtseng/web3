import { ParsedTransactionWithMeta } from '@solana/web3.js';

export function getGasFee(
  parsedTransactionWithMeta: ParsedTransactionWithMeta
) {
  return (parsedTransactionWithMeta.meta?.fee ?? 0).toString();
}
