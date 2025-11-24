import { NETWORKS } from '../constants';
import { loadImage } from '../utils/loaders';

export async function getTokenIcon(network: string, address: string) {
  if (network === NETWORKS.BSC) {
    const url = `https://assets.trustwalletapp.com/blockchains/smartchain/assets/${address}/logo.png`;
    const blob = await loadImage(url);

    return {
      blob,
      url,
    };
  }

  const res = await fetch(
    `https://api.coingecko.com/api/v3/coins/ethereum/contract/${address}`
  );
  const result = await res.json();
  const url = result.image.small;
  const blob = await loadImage(url);

  return {
    blob,
    url,
  };
}
