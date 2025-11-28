import { Cell, TonClient } from '@ton/ton';
import { waitForTransaction } from './waitForTransaction';

export async function getTransaction({
  boc,
  address,
  client,
}: {
  boc: string;
  client: TonClient;
  address: string;
}) {
  const cell = Cell.fromBase64(boc);
  const buffer = cell.hash();
  const txHash = buffer.toString('hex');

  const transaction = await waitForTransaction(
    { hash: txHash, address },
    client
  );

  return transaction;
}
