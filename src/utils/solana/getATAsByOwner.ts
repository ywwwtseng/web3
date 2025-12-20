import { Connection } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID } from '@solana/spl-token';
import { getParsedTokenAccountsByOwner } from './getParsedTokenAccountsByOwner';

export async function getATAsByOwner(
  connection: Connection,
  {
    address,
  }: {
    address: string;
  }
) {
  const [atas = [], atas2022 = []] = await Promise.all([
    getParsedTokenAccountsByOwner(connection, { address, programId: TOKEN_PROGRAM_ID }),
    getParsedTokenAccountsByOwner(connection, { address, programId: TOKEN_2022_PROGRAM_ID }),
  ]);
  return [...atas, ...atas2022];
}