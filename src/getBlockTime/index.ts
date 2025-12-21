import { type ParsedTransactionWithMeta } from '@solana/web3.js';
import { type TransactionReceipt, JsonRpcProvider } from 'ethers';
import { Transaction } from '@ton/ton';
import * as utils from '../utils';
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
    return utils.solana.getBlockTime(transaction as ParsedTransactionWithMeta);
  } else if (network === NETWORKS.ETHEREUM || network === NETWORKS.BSC) {
    if (!provider) {
      throw new Error('Provider is required for EVM');
    }

    return await utils.evm.getBlockTime({
      provider,
      receipt: transaction as TransactionReceipt,
    });
  } else if (network === NETWORKS.TON) {
    return utils.ton.getBlockTime(transaction as Transaction);
  }

  throw new Error(`Network ${network} not supported`);
}
