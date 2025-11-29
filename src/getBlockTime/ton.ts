import { Transaction } from '@ton/ton';

export function getBlockTime(transaction: Transaction) {
  return transaction.now;
}
