import { Connection } from '@solana/web3.js';
import { JsonRpcProvider } from 'ethers';
import { TonClient, Address } from '@ton/ton';
import * as evm from './evm';
import * as solana from './solana';
import * as ton from './ton';
import { NETWORKS } from '../constants';

export function getTransfer({
  network,
  provider,
  connection,
  client,
  source,
  destination,
}: {
  network: string;
  provider?: JsonRpcProvider;
  connection?: Connection;
  client?: TonClient;
  source: string;
  destination: string;
}) {
  return async (hash: string) => {
    if (network === NETWORKS.ETHEREUM || network === NETWORKS.BSC) {
      if (!provider) {
        throw new Error('Provider is required for EVM');
      }

      const transfer = await evm.getTransfer({
        provider,
        hash,
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
        hash,
      });

      return (
        transfers.find(
          (transfer) =>
            transfer.source === source && transfer.destination === destination
        ) ?? null
      );
    } else if (network === NETWORKS.TON) {
      if (!client) {
        throw new Error('Client is required for TON');
      }

      const transfer = await ton.getTransfer({
        client,
        source,
        hash,
      });

      if (!transfer) {
        return null;
      }

      // 使用 @ton/ton 的 Address.parse() 和 equals() 來比較地址
      // 這樣可以正確處理所有 TON 地址格式（bounceable, non-bounceable, raw 等）
      const sourceAddress = Address.parse(source);
      const destinationAddress = Address.parse(destination);
      const transferSourceAddress = Address.parse(transfer.source);
      const transferDestinationAddress = Address.parse(transfer.destination);

      if (
        sourceAddress.equals(transferSourceAddress) &&
        destinationAddress.equals(transferDestinationAddress)
      ) {
        return transfer;
      } else {
        return null;
      }
    }

    throw new Error(`Network ${network} not supported`);
  };
}
