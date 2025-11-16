import { Connection, PublicKey } from '@solana/web3.js';
import {
  getAssociatedTokenAddressSync,
  getAccount,
  TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
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
          tokenProgram,
        }: {
          address: string;
          tokenAddress?: string | null;
          tokenProgram?: string | null;
        }
      ) => {
        if (tokenAddress) {
          // 根据 tokenProgram 选择使用标准 Token 还是 Token 2022
          // Token 2022 程序 ID: TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb
          const programId =
            tokenProgram === TOKEN_2022_PROGRAM_ID.toString()
              ? TOKEN_2022_PROGRAM_ID
              : TOKEN_PROGRAM_ID;

          const ownerATA = getAssociatedTokenAddressSync(
            new PublicKey(tokenAddress),
            new PublicKey(address),
            false,
            programId,
            ASSOCIATED_TOKEN_PROGRAM_ID
          );

          const account = await getAccount(
            connection,
            ownerATA,
            undefined,
            programId
          );
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
