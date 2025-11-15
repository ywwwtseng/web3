import { NETWORKS, RPC_URL } from '../constants';

export function getRpcUrl(network: string) {
  switch (network) {
    case NETWORKS.SOLANA:
      return RPC_URL.SOLANA_DEV;
    case NETWORKS.BSC:
      return RPC_URL.BSC;
    default:
      throw new Error(`Network ${network} not supported`);
  }
}
