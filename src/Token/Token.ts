import { JsonRpcProvider, Contract, getAddress } from 'ethers';
import { ERC20_ABI } from '../abi/ERC20_ABI';
import { loadImage } from '../utils/loaders';
import { NETWORKS } from '../constants';
import * as evm from '../evm';

export interface TokenInfo {
  name: string;
  symbol: string;
  decimals: number;
  address: string;
  icon: string;
  icon_file?: File;
  tokenProgram?: string;
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
      },
    };
  }
  // ethereum
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

        const icon = await evm.getTokenIcon(network, address);
        const usdPrice = await evm.getTokenPrice(network, address);

        return {
          // return EIP-55 address
          address: getAddress(await contract.getAddress()),
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
    };
  }

  static get ton() {
    return {
      getInfo: async (address: string): Promise<TokenInfo> => {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/ton/contract/${address}`
        );

        const data = (await res.json()) as {
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

        const blob = await loadImage(data.image.small);

        return {
          name: data.name,
          symbol: data.symbol,
          decimals: data.detail_platforms['the-open-network'].decimal_place,
          address: data.detail_platforms['the-open-network'].contract_address,
          icon: data.image.small,
          icon_file: blob
            ? new File([blob], data.symbol.toLowerCase(), { type: blob.type })
            : undefined,
          tokenProgram: undefined,
          usdPrice: data.market_data.low_24h.usd.toString(),
        };
      },
    };
  }

  static get tron() {
    return {
      getInfo: async (address: string): Promise<TokenInfo> => {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/tron/contract/${address}`
        );

        const data = (await res.json()) as {
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
          market_data: {
            low_24h: {
              usd: number;
            };
          };
        };

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
          usdPrice: data.market_data.low_24h.usd.toString(),
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
    rpcUrl?: string;
  }): Promise<TokenInfo> {
    if (network === NETWORKS.SOLANA) {
      return await this.solana.getInfo(address);
    } else if (network === NETWORKS.TON) {
      return await this.ton.getInfo(address);
    } else if (network === NETWORKS.TRON) {
      return await this.tron.getInfo(address);
    } else if (network === NETWORKS.ETHEREUM || network === NETWORKS.BSC) {
      if (!rpcUrl) {
        throw new Error('RPC URL is required for getting EVM token info');
      }
      return await this.evm.getInfo({ rpcUrl, network, address });
    } else {
      throw new Error('message.network_not_supported', {
        cause: `Network ${network} not supported`,
      });
    }
  }
}
