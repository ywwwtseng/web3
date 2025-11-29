import { Cell } from '@ton/ton';

export function getTxHash(boc: string) {
  const cell = Cell.fromBase64(boc);
  const buffer = cell.hash();
  const txHash = buffer.toString('hex');

  return txHash;
}
