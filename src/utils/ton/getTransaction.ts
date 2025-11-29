import { Cell, TonClient } from '@ton/ton';
import { waitForTransaction } from './waitForTransaction';

export async function getTransaction({
  txHash,
  address,
  client,
}: {
  txHash: string;
  client: TonClient;
  address: string;
}) {
  const transaction = await waitForTransaction({
    client,
    hash: txHash,
    address,
  });

  console.log(transaction.outMessages, 'transaction.outMessages');

  return transaction;
}
