import { JsonRpcProvider } from 'ethers';
import * as utils from '../utils';
import { NETWORKS } from '../constants';

export interface TokenInfo {
  name: string;
  symbol: string;
  decimals: number;
  address: string;
  icon: string;
  icon_file?: File;
  tokenProgram?: string;
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

      return await utils.evm.getTokenInfo.ethereum({ provider, address });
    } else if (network === NETWORKS.BSC) {
      return await utils.evm.getTokenInfo.bsc({ provider, address });
    } else if (network === NETWORKS.SOLANA) {
      return await utils.solana.getTokenInfo({ address });
    } else if (network === NETWORKS.TON) {
      return await utils.ton.getTokenInfo({ address });
    } else if (network === NETWORKS.TRON) {
      return await utils.tron.getTokenInfo({ address });
    }

    throw new Error(`Network ${network} not supported`);
  };
}
