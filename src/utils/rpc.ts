import { NETWORKS, RPC_URL } from '../constants';

export function getRpcUrl(
  network: string,
  options: { infuraApiKey?: string } = {}
) {
  switch (network) {
    case NETWORKS.SOLANA:
      return RPC_URL.SOLANA_DEV;
    case NETWORKS.BSC:
      return RPC_URL.BSC;
    case NETWORKS.ETHEREUM:
      if (!options.infuraApiKey) {
        throw new Error('Infura API key is required');
      }
      return RPC_URL.ETHEREUM_MAINNET(options.infuraApiKey);
    default:
      throw new Error(`Network ${network} not supported`);
  }
}
