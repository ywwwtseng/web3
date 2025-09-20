import { JsonRpcProvider, Contract } from 'ethers';
import { ERC20_ABI } from '../abi/ERC20_ABI';
import { loadImage } from '../utils/loaders';
import { NETWORK } from '../constants';

export interface TokenInfo {
  name: string;
  symbol: string;
  decimals: number;
  icon: string;
  icon_file?: File;
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
        };
      },
      getIcon: async (network: string, address: string) => {
        if (network === NETWORK.BSC) {
          const url = `https://assets.trustwalletapp.com/blockchains/smartchain/assets/${address}/logo.png`;
          const blob = await loadImage(url);

          return {
            blob,
            url,
          };
        }

        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/ethereum/contract/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48${address}`
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
    if (network === NETWORK.SOLANA) {
      return await this.solana.getInfo(address);
    } else {
      return await this.evm.getInfo({ rpcUrl, network, address });
    }
  }
}
