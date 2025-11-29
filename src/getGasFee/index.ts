import { ParsedTransactionWithMeta } from '@solana/web3.js';
import { TransactionReceipt } from 'ethers';
import { Transaction } from '@ton/ton';
import * as solana from './solana';
import * as evm from './evm';
import * as ton from './ton';
import { NETWORKS } from '../constants';

export function getGasFee({
  network,
  transaction,
}: {
  network: (typeof NETWORKS)[keyof typeof NETWORKS];
  transaction: ParsedTransactionWithMeta | TransactionReceipt | Transaction;
}) {
  if (!transaction) {
    throw new Error('Receipt is required for EVM');
  }

  if (network === NETWORKS.SOLANA) {
    return solana.getGasFee(transaction as ParsedTransactionWithMeta);
  } else if (network === NETWORKS.ETHEREUM || network === NETWORKS.BSC) {
    return evm.getGasFee(transaction as TransactionReceipt);
  } else if (network === NETWORKS.TON) {
    return ton.getGasFee(transaction as Transaction);
  }

  throw new Error(`Network ${network} not supported`);
}
