import { Connection } from '@solana/web3.js';
import { JsonRpcProvider } from 'ethers';
import TonWeb from 'tonweb';
import * as solana from './solana';
import * as evm from './evm';
import * as ton from './ton';
import { NETWORKS } from '../constants';

export function getBalance({
  network,
  provider,
  connection,
}: {
  network: string;
  provider?: JsonRpcProvider | InstanceType<typeof TonWeb.HttpProvider>;
  connection?: Connection;
}) {
  return async ({
    address,
    tokenAddress,
    tokenProgram,
  }: {
    address: string;
    tokenAddress?: string | null;
    tokenProgram?: string | null;
  }): Promise<string> => {
    if (network === NETWORKS.SOLANA) {
      if (!connection) {
        throw new Error('Connection is required for SOLANA');
      }

      return await solana.getBalance(connection, {
        address,
        tokenAddress,
        tokenProgram,
      });
    } else if (network === NETWORKS.BSC || network === NETWORKS.ETHEREUM) {
      if (!provider) {
        throw new Error('Provider is required for BSC or ETHEREUM');
      }

      if (!(provider instanceof JsonRpcProvider)) {
        throw new Error('Provider must be an instance of JsonRpcProvider');
      }

      return await evm.getBalance(provider, {
        address,
        tokenAddress,
      });
    } else if (network === NETWORKS.TON) {
      if (!provider) {
        throw new Error('Provider is required for TON');
      }

      if (!(provider instanceof TonWeb.HttpProvider)) {
        throw new Error('Provider must be an instance of HttpProvider');
      }

      return await ton.getBalance({
        provider,
        address,
        tokenAddress,
      });
    }

    throw new Error(`Network ${network} not supported`);
  };
}
