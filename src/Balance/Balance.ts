import { Connection, PublicKey } from '@solana/web3.js';
import {
  getAssociatedTokenAddressSync,
  getAccount,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { JsonRpcProvider, Contract } from 'ethers';
import { ERC20_ABI } from '../abi/ERC20_ABI';

export class Balance {
  static get solana() {
    return {
      get: async (
        connection: Connection,
        {
          address,
          tokenAddress,
        }: { address: string; tokenAddress?: string | null }
      ) => {
        if (tokenAddress) {
          const ownerATA = getAssociatedTokenAddressSync(
            new PublicKey(tokenAddress),
            new PublicKey(address),
            false,
            TOKEN_PROGRAM_ID,
            ASSOCIATED_TOKEN_PROGRAM_ID
          );

          const account = await getAccount(connection, ownerATA);
          return account.amount;
        } else {
          return await connection.getBalance(new PublicKey(address));
        }
      },
    };
  }

  static get evm() {
    return {
      get: async (
        provider: JsonRpcProvider,
        {
          address,
          tokenAddress,
        }: {
          address: string;
          tokenAddress?: string | null;
        }
      ) => {
        if (tokenAddress) {
          const contract = new Contract(tokenAddress, ERC20_ABI, provider);
          return await contract.balanceOf(address);
        } else {
          return await provider.getBalance(address);
        }
      },
    };
  }
}
