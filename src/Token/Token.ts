import { JsonRpcProvider, Contract } from 'ethers';
import { ERC20_ABI } from '../abi/ERC20_ABI';
import { loadImage } from '../utils/loaders';
import { NETWORKS } from '../constants';

export interface TokenInfo {
  name: string;
  symbol: string;
  decimals: number;
  icon: string;
  icon_file?: File;
  usdPrice: string | null;
}

export class Token {
  static get solana() {
    return {
      getInfo: async (address: string): Promise<TokenInfo> => {
        const res = await fetch(
          `https://lite-api.jup.ag/tokens/v2/search?query=${address}`
        );

        const result = (await res.json()) as {
          name: string;
          symbol: string;
          decimals: number;
          icon: string;
          usdPrice: string;
        }[];

        if (result.length === 0) {
          throw new Error('message.token_not_found');
        }

        const blob = await loadImage(result[0].icon);

        return {
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
        };
      },
    };
  }
  static get evm() {
    return {
      getInfo: async ({
        address,
        network,
        rpcUrl,
      }: {
        address: string;
        network: string;
        rpcUrl: string;
      }): Promise<TokenInfo> => {
        const provider = new JsonRpcProvider(rpcUrl);
        const contract = new Contract(address, ERC20_ABI, provider);
        const name = await contract.name();
        const symbol = await contract.symbol();
        const decimals = await contract.decimals();

        if (!name || !symbol || !decimals) {
          throw new Error('message.token_not_found');
        }

        const icon = await this.evm.getIcon(network, address);

        let usdPrice: string | null = null;
        try {
          const res = await fetch(
            `https://api.dexscreener.com/latest/dex/search?q=${address}`
          );
          const data = await res.json();

          if (data.pairs && data.pairs.length > 0) {
            // 取 TVL 最大的交易對（通常最準確）
            const mainPair = data.pairs.sort(
              (a: any, b: any) =>
                (b.liquidity?.usd ?? 0) - (a.liquidity?.usd ?? 0)
            )[0];

            usdPrice = mainPair.priceUsd ?? null;
          }
        } catch (error) {
          console.error('Dexscreener error:', error);
        }

        return {
          name,
          symbol,
          decimals: Number(decimals),
          icon: icon.url,
          icon_file: icon.blob
            ? new File([icon.blob], name, {
                type: icon.blob.type,
              })
            : null,
          usdPrice,
        };
      },
      getIcon: async (network: string, address: string) => {
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
      },
    };
  }

  static async getInfo({
    address,
    network,
    rpcUrl,
  }: {
    address: string;
    network: string;
    rpcUrl: string;
  }): Promise<TokenInfo> {
    if (network === NETWORKS.SOLANA) {
      return await this.solana.getInfo(address);
    } else {
      return await this.evm.getInfo({ rpcUrl, network, address });
    }
  }
}
