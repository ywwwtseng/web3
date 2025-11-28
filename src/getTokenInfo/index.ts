import { JsonRpcProvider } from 'ethers';
import * as ethereum from './ethereum';
import * as bsc from './bsc';
import * as solana from './solana';
import * as ton from './ton';
import * as tron from './tron';
import { NETWORKS } from '../constants';

export interface TokenInfo {
  name: string;
  symbol: string;
  decimals: number;
  address: string;
  icon: string;
  icon_file?: File;
  tokenProgram?: string;
  usdPrice: string | null;
}

export function getTokenInfo({
  network,
  provider,
}: {
  network: string;
  provider?: JsonRpcProvider;
}) {
  return async (address: string): Promise<TokenInfo> => {
    if (network === NETWORKS.ETHEREUM) {
      if (!provider) {
        throw new Error('Provider is required for ETHEREUM');
      }

      return await ethereum.getTokenInfo({ provider, address });
    } else if (network === NETWORKS.BSC) {
      return await bsc.getTokenInfo({ provider, address });
    } else if (network === NETWORKS.SOLANA) {
      return await solana.getTokenInfo({ address });
    } else if (network === NETWORKS.TON) {
      return await ton.getTokenInfo({ address });
    } else if (network === NETWORKS.TRON) {
      return await tron.getTokenInfo({ address });
    }

    throw new Error(`Network ${network} not supported`);
  };
}
