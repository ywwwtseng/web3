import { Connection, type ParsedTransactionWithMeta } from '@solana/web3.js';
import {
  JsonRpcProvider,
  type TransactionReceipt,
  Contract,
  Wallet,
} from 'ethers';
import {
  createTransaction,
  CreateTransactionParams,
} from '../solana/createTransaction';
import { decodeTransfer } from '../solana/decodeTransfer';
import { Cell, TonClient } from '@ton/ton';
import { getTransfers } from '../solana/getTransfers';
import { getTransfer } from '../evm/getTransfer';
import { waitForTransaction } from '../ton/waitForTransaction';
import type { Transfer } from '../types';
import { ERC20_ABI } from '../abi/ERC20_ABI';
import { NETWORKS } from '../constants';

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
        params: CreateTransactionParams
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
        return (parsedTransactionWithMeta.meta?.fee ?? 0).toString();
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
        return (receipt.gasUsed * receipt.gasPrice).toString();
      },
      getBlockTime: async (
        provider: JsonRpcProvider,
        receipt: TransactionReceipt
      ) => {
        const block = await provider.getBlock(receipt.blockNumber);
        return block.timestamp;
      },
      estimateFee: async (
        provider: JsonRpcProvider,
        params?: {
          tokenAddress: string;
          signer: Wallet;
          destination: string;
          amount: string | bigint;
        }
      ) => {
        const feeData = await provider.getFeeData();

        if (!params) {
          const gasLimit = 21000n;
          return (feeData.gasPrice * gasLimit).toString();
        } else {
          const contract = new Contract(
            params.tokenAddress,
            ERC20_ABI,
            params.signer
          );

          const gasLimit = await contract.transfer.estimateGas(
            params.destination,
            typeof params.amount === 'string'
              ? BigInt(params.amount)
              : params.amount
          );

          return (feeData.gasPrice * gasLimit).toString();
        }
      },
    };
  }

  static get ton() {
    return {
      get: async (
        boc: string,
        { rpcUrl, address }: { rpcUrl: string; address: string }
      ) => {
        const cell = Cell.fromBase64(boc);
        const buffer = cell.hash();
        const txHash = buffer.toString('hex');

        const client = new TonClient({
          endpoint: rpcUrl,
        });

        const transaction = await waitForTransaction(
          { hash: txHash, address },
          client
        );

        return transaction;
      },
    };
  }

  static getGasFee(
    txData: ParsedTransactionWithMeta | TransactionReceipt,
    { network }: { network: (typeof NETWORKS)[keyof typeof NETWORKS] }
  ) {
    if (network === NETWORKS.SOLANA) {
      return Transaction.solana.getGasFee(txData as ParsedTransactionWithMeta);
    } else if (network === NETWORKS.ETHEREUM || network === NETWORKS.BSC) {
      return Transaction.evm.getGasFee(txData as TransactionReceipt);
    }
  }

  static async getBlockTime(
    txData: ParsedTransactionWithMeta | TransactionReceipt,
    {
      network,
      rpcUrl,
    }: {
      network: (typeof NETWORKS)[keyof typeof NETWORKS];
      rpcUrl: string;
    }
  ) {
    if (network === NETWORKS.SOLANA) {
      return Transaction.solana.getBlockTime(
        txData as ParsedTransactionWithMeta
      );
    } else if (network === NETWORKS.ETHEREUM || network === NETWORKS.BSC) {
      const provider = new JsonRpcProvider(rpcUrl);
      return await Transaction.evm.getBlockTime(
        provider,
        txData as TransactionReceipt
      );
    }
  }

  static async getTransfer(
    txData: string | ParsedTransactionWithMeta | TransactionReceipt,
    params: {
      network: (typeof NETWORKS)[keyof typeof NETWORKS];
      rpcUrl: string;
      source: string;
      destination: string;
    }
  ): Promise<Transfer | null> {
    if (
      params.network === NETWORKS.ETHEREUM ||
      params.network === NETWORKS.BSC
    ) {
      const provider = new JsonRpcProvider(params.rpcUrl);
      const transfer = await Transaction.evm.getTransfer(
        provider,
        txData as string | TransactionReceipt
      );
      if (
        transfer &&
        transfer.source === params.source &&
        transfer.destination === params.destination
      ) {
        return transfer;
      } else {
        return null;
      }
    } else if (params.network === NETWORKS.SOLANA) {
      const connection = new Connection(params.rpcUrl);
      const transfers = await Transaction.solana.getTransfers(
        connection,
        txData as string | ParsedTransactionWithMeta
      );

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
