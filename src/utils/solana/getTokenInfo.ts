import { loadImage } from '../loaders';

export async function getTokenIcon(address: string) {
  const res = await fetch(
    `https://api.coingecko.com/api/v3/coins/solana/contract/${address}`
  );
  const result = await res.json();
  const url = result.image.small;
  const blob = await loadImage(url);

  return {
    blob,
    url,
  };
}

export async function getTokenInfo({ address }: { address: string }) {
  const res = await fetch(
    `https://lite-api.jup.ag/tokens/v2/search?query=${address}`
  );

  const result = (await res.json()) as {
    id: string;
    name: string;
    symbol: string;
    decimals: number;
    icon: string;
    usdPrice: number;
    tokenProgram: string;
  }[];

  if (result.length === 0) {
    throw new Error('message.token_not_found', {
      cause: `Token ${address} not found`,
    });
  }

  const icon = await getTokenIcon(address);

  return {
    address: result[0].id,
    name: result[0].name,
    symbol: result[0].symbol,
    decimals: result[0].decimals,
    icon: icon.url,
    icon_file: icon.blob
      ? new File([icon.blob], result[0].name, {
          type: icon.blob.type,
        })
      : null,
    usdPrice: String(result[0].usdPrice),
    tokenProgram: result[0].tokenProgram,
  };
}
