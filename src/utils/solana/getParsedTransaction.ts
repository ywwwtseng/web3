import { Connection } from '@solana/web3.js';

export async function getParsedTransaction({
  connection,
  signature,
}: {
  connection: Connection;
  signature: string;
}) {
  return await connection.getParsedTransaction(signature, {
    maxSupportedTransactionVersion: 0,
    commitment: 'finalized',
  });
}
