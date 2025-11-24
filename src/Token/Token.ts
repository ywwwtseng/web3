import { JsonRpcProvider, Contract } from 'ethers';
import { ERC20_ABI } from '../abi/ERC20_ABI';
import { loadImage } from '../utils/loaders';
import { NETWORKS } from '../constants';
import * as evm from '../evm';

export interface TokenInfo {
  name: string;
  symbol: string;
  decimals: number;
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
