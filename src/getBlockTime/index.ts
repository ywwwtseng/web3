import { type ParsedTransactionWithMeta } from '@solana/web3.js';
import { type TransactionReceipt, JsonRpcProvider } from 'ethers';
import { Transaction } from '@ton/ton';
import * as solana from './solana';
import * as evm from './evm';
import * as ton from './ton';
import { NETWORKS } from '../constants';

export async function getBlockTime({
  network,
  provider,
  transaction,
}: {
  network: (typeof NETWORKS)[keyof typeof NETWORKS];
  provider?: JsonRpcProvider;
  transaction: TransactionReceipt | ParsedTransactionWithMeta | Transaction;
}) {
  if (network === NETWORKS.SOLANA) {
    return solana.getBlockTime(transaction as ParsedTransactionWithMeta);
  } else if (network === NETWORKS.ETHEREUM || network === NETWORKS.BSC) {
    if (!provider) {
      throw new Error('Provider is required for EVM');
    }

    return await evm.getBlockTime({
      provider,
      receipt: transaction as TransactionReceipt,
    });
  } else if (network === NETWORKS.TON) {
    return ton.getBlockTime(transaction as Transaction);
  }

  throw new Error(`Network ${network} not supported`);
}
