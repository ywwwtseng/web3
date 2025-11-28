import { ParsedTransactionWithMeta } from '@solana/web3.js';
import { TransactionReceipt } from 'ethers';
import * as solana from './solana';
import * as evm from './evm';
import { NETWORKS } from '../constants';

export function getGasFee({
  network,
}: {
  network: (typeof NETWORKS)[keyof typeof NETWORKS];
}) {
  return async (
    txData: string | TransactionReceipt | ParsedTransactionWithMeta
  ) => {
    if (network === NETWORKS.SOLANA) {
      return solana.getGasFee(txData as ParsedTransactionWithMeta);
    } else if (network === NETWORKS.ETHEREUM || network === NETWORKS.BSC) {
      if (!txData) {
        throw new Error('Receipt is required for EVM');
      }

      return evm.getGasFee(txData as TransactionReceipt);
    }
  };
}
