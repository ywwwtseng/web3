import { type ParsedTransactionWithMeta } from '@solana/web3.js';
import { type TransactionReceipt, JsonRpcProvider } from 'ethers';
import * as solana from './solana';
import * as evm from './evm';
import { NETWORKS } from '../constants';

export function getBlockTime({
  network,
  provider,
}: {
  network: (typeof NETWORKS)[keyof typeof NETWORKS];
  provider?: JsonRpcProvider;
}) {
  return async (txData: TransactionReceipt | ParsedTransactionWithMeta) => {
    if (network === NETWORKS.SOLANA) {
      return solana.getBlockTime(txData as ParsedTransactionWithMeta);
    } else if (network === NETWORKS.ETHEREUM || network === NETWORKS.BSC) {
      if (!provider) {
        throw new Error('Provider is required for EVM');
      }

      return await evm.getBlockTime({
        provider,
        receipt: txData as TransactionReceipt,
      });
    }
  };
}
