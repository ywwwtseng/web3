import { loadImage } from '../loaders';

export async function getTokenInfo({ address }: { address: string }) {
  const res = await fetch(
    `https://api.coingecko.com/api/v3/coins/tron/contract/${address}`
  );

  const data = (await res.json()) as {
    error?: string;
    name: string;
    symbol: string;
    detail_platforms: {
      tron: {
        decimal_place: number;
        contract_address: string;
      };
    };
    image: {
      thumb: string;
      small: string;
      large: string;
    };
  };

  if (data.error) {
    throw new Error('message.token_not_found', {
      cause: `Token ${address} not found`,
    });
  }

  const blob = await loadImage(data.image.small);

  return {
    name: data.name,
    symbol: data.symbol,
    decimals: data.detail_platforms['tron'].decimal_place,
    address: data.detail_platforms['tron'].contract_address,
    icon: data.image.small,
    icon_file: blob
      ? new File([blob], data.symbol.toLowerCase(), { type: blob.type })
      : undefined,
    tokenProgram: undefined,
  };
}
