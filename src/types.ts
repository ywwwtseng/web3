import { ParsedTransactionWithMeta } from '@solana/web3.js';
import { TransactionReceipt } from 'ethers';
import { Transaction } from '@ton/ton';

export type Transfer<T = ParsedTransactionWithMeta | TransactionReceipt | Transaction> = {
  source: string;
  destination: string;
  amount: string;
  tokenAddress?: string;
  transaction: T;
};
