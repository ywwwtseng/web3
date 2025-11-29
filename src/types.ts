import { ParsedTransactionWithMeta } from '@solana/web3.js';
import { TransactionReceipt } from 'ethers';
import { Transaction } from '@ton/ton';

export type Transfer = {
  source: string;
  destination: string;
  amount: string;
  tokenAddress?: string;
  transaction: ParsedTransactionWithMeta | TransactionReceipt | Transaction;
};
