import { Connection } from '@solana/web3.js';
import { TransactionReceipt, JsonRpcProvider } from 'ethers';
import { type ParsedTransactionWithMeta } from '@solana/web3.js';
import * as evm from './evm';
import * as solana from './solana';
import { NETWORKS } from '../constants';

export function getTransfer({
  network,
  provider,
  connection,
  source,
  destination,
}: {
  network: string;
  provider?: JsonRpcProvider;
  connection?: Connection;
  source: string;
  destination: string;
}) {
  return async (
    txData: string | TransactionReceipt | ParsedTransactionWithMeta
  ) => {
    if (network === NETWORKS.ETHEREUM || network === NETWORKS.BSC) {
      if (!provider) {
        throw new Error('Provider is required for EVM');
      }

      const transfer = await evm.getTransfer({
        provider,
        receipt: txData as string | TransactionReceipt,
      });

      if (
        transfer &&
        transfer.source === source &&
        transfer.destination === destination
      ) {
        return transfer;
      } else {
        return null;
      }
    } else if (network === NETWORKS.SOLANA) {
      const transfers = await solana.getTransfers({
        connection,
        transaction: txData as ParsedTransactionWithMeta,
      });

      return (
        transfers.find(
          (transfer) =>
            transfer.source === source && transfer.destination === destination
        ) ?? null
      );
    }

    throw new Error(`Network ${network} not supported`);
  };
}
