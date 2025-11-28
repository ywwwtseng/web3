import { loadImage } from '../utils';

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
    usdPrice: string;
    tokenProgram: string;
  }[];

  if (result.length === 0) {
    throw new Error('message.token_not_found', {
      cause: `Token ${address} not found`,
    });
  }

  const blob = await loadImage(result[0].icon);

  return {
    address: result[0].id,
    name: result[0].name,
    symbol: result[0].symbol,
    decimals: result[0].decimals,
    icon: result[0].icon,
    icon_file: blob
      ? new File([blob], result[0].name, {
          type: blob.type,
        })
      : null,
    usdPrice: result[0].usdPrice,
    tokenProgram: result[0].tokenProgram,
  };
}
