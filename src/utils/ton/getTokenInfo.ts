import { Address } from '@ton/ton';
import { loadImage } from '../loaders';

export async function getTokenInfo({ address }: { address: string }) {
  if (address === 'EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs') {
    const res = await fetch(`https://tonapi.io/v2/jettons/${address}`);

    const data = (await res.json()) as {
      error?: string;
      metadata: {
        name: string;
        symbol: string;
        decimals: string;
        image: string;
        address: string;
      };
    };

    if (data.error) {
      throw new Error('message.token_not_found', {
        cause: `Token ${address} not found`,
      });
    }

    const blob = await loadImage(data.metadata.image);

    return {
      name: data.metadata.name,
      symbol: data.metadata.symbol,
      decimals: Number(data.metadata.decimals),
      address: Address.parse(address).toString({
        urlSafe: true,
        bounceable: true,
      }),
      icon: data.metadata.image,
      icon_file: blob
        ? new File([blob], data.metadata.symbol.toLowerCase(), {
            type: blob.type,
          })
        : undefined,
      tokenProgram: undefined,
      usdPrice: '1',
    };
  } else {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/ton/contract/${address}`
    );

    const data = (await res.json()) as {
      error?: string;
      name: string;
      symbol: string;
      detail_platforms: {
        'the-open-network': {
          decimal_place: number;
          contract_address: string;
        };
      };
      image: {
        thumb: string;
        small: string;
        large: string;
      };
      market_data: {
        low_24h: {
          usd: number;
        };
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
      decimals: data.detail_platforms['the-open-network'].decimal_place,
      address: Address.parse(
        data.detail_platforms['the-open-network'].contract_address
      ).toString({
        urlSafe: true,
        bounceable: true,
      }),
      icon: data.image.small,
      icon_file: blob
        ? new File([blob], data.symbol.toLowerCase(), { type: blob.type })
        : undefined,
      tokenProgram: undefined,
      usdPrice: data.market_data.low_24h.usd.toString(),
    };
  }
}
