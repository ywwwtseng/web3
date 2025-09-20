import { Connection, type ParsedTransactionWithMeta } from '@solana/web3.js';
import { JsonRpcProvider, type TransactionReceipt } from 'ethers';
import {
  createTransaction,
  CreateSolanaTransactionParams,
} from '../solana/createTransaction';
import { decodeTransfer } from '../solana/decodeTransfer';
import { getTransfers } from '../solana/getTransfers';
import { getTransfer } from '../evm/getTransfer';
import type { Transfer } from '../types';

export class Transaction {
  static get solana() {
    return {
      get: async (
        connection: Connection,
        {
          signature,
        }: {
          signature: string;
        }
      ) => {
        const transaction = await connection.getParsedTransaction(signature, {
          maxSupportedTransactionVersion: 0,
          commitment: 'finalized',
        });

        return transaction;
      },
      create: async (
        connection: Connection,
        params: CreateSolanaTransactionParams
      ) => {
        return createTransaction(connection, params);
      },
      decodeTransfer: async (connection: Connection, base64: string) => {
        return decodeTransfer(connection, base64);
      },
      getTransfers: async (
        connection: Connection,
        src: string | ParsedTransactionWithMeta
      ) => {
        if (typeof src === 'string') {
          const parsedTransaction = await Transaction.solana.get(connection, {
            signature: src,
          });

          return getTransfers(parsedTransaction);
        } else {
          return getTransfers(src);
        }
      },
      getGasFee: (parsedTransactionWithMeta: ParsedTransactionWithMeta) => {
        return parsedTransactionWithMeta.meta?.fee ?? 0;
      },
      getBlockTime: (parsedTransactionWithMeta: ParsedTransactionWithMeta) => {
        return parsedTransactionWithMeta.blockTime;
      },
    };
  }

  static get evm() {
    return {
      get: async (provider: JsonRpcProvider, txHash: string) => {
        return await provider.getTransaction(txHash);
      },
      getReceipt: async (provider: JsonRpcProvider, txHash: string) => {
        return await provider.getTransactionReceipt(txHash);
      },
      getTransfer: async (
        provider: JsonRpcProvider,
        src: string | TransactionReceipt
      ) => {
        let receipt: string | TransactionReceipt = src;
        if (typeof src === 'string') {
          receipt = await Transaction.evm.getReceipt(provider, src);
        }

        if (
          !receipt ||
          typeof receipt !== 'object' ||
          ('status' in receipt && receipt.status !== 1)
        ) {
          return null;
        }

        const transaction = await Transaction.evm.get(provider, receipt.hash);

        return getTransfer({ receipt, transaction });
      },
      getGasFee: (receipt: TransactionReceipt) => {
        return Number(receipt.gasUsed) * Number(receipt.gasPrice);
      },
      getBlockTime: async (
        provider: JsonRpcProvider,
        receipt: TransactionReceipt
      ) => {
        const block = await provider.getBlock(receipt.blockNumber);
        return block.timestamp;
      },
    };
  }

  static getGasFee(src: ParsedTransactionWithMeta | TransactionReceipt) {
    if ('meta' in src) {
      return Transaction.solana.getGasFee(src);
    } else {
      return Transaction.evm.getGasFee(src);
    }
  }

  static async getBlockTime(
    src: ParsedTransactionWithMeta | TransactionReceipt,
    rpcUrl: string
  ) {
    if ('meta' in src) {
      return Transaction.solana.getBlockTime(src);
    } else {
      const provider = new JsonRpcProvider(rpcUrl);
      return await Transaction.evm.getBlockTime(provider, src);
    }
  }

  static async getTransfer(
    src: string | ParsedTransactionWithMeta | TransactionReceipt,
    params: {
      rpcUrl: string;
      source: string;
      destination: string;
    }
  ): Promise<Transfer | null> {
    if (params.source.startsWith('0x')) {
      const receipt = src as TransactionReceipt | null;
      const provider = new JsonRpcProvider(params.rpcUrl);
      const transfer = await Transaction.evm.getTransfer(provider, receipt);
      if (
        transfer &&
        transfer.source === params.source &&
        transfer.destination === params.destination
      ) {
        return transfer;
      } else {
        return null;
      }
    } else {
      const tx = src as ParsedTransactionWithMeta | null;
      const connection = new Connection(params.rpcUrl);
      const transfers = await Transaction.solana.getTransfers(connection, tx);

      return (
        transfers.find(
          (transfer) =>
            transfer.source === params.source &&
            transfer.destination === params.destination
        ) ?? null
      );
    }
  }
}
