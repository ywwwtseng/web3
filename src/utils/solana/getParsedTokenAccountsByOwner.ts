import {
  Connection,
  PublicKey,
} from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

export async function getParsedTokenAccountsByOwner(
  connection: Connection,
  {
    address,
    programId = TOKEN_PROGRAM_ID,
  }: {
    address: string;
    programId?: PublicKey;
  }
) {
  const accounts = await connection.getParsedTokenAccountsByOwner(
    new PublicKey(address),
    { programId }
  );
  return accounts.value.map(v => v.pubkey.toString());
}
