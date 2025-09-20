import { NETWORK, RPC_URL } from '../constants';

export function getRpcUrl(network: string) {
  switch (network) {
    case NETWORK.SOLANA:
      return RPC_URL.SOLANA_DEV;
    case NETWORK.BSC:
      return RPC_URL.BINANCE;
    default:
      throw new Error(`Network ${network} not supported`);
  }
}
