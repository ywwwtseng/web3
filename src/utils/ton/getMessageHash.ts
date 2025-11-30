import { Cell } from '@ton/ton';

export function getMessageHash(boc: string) {
  const cell = Cell.fromBase64(boc);
  const buffer = cell.hash();
  return buffer.toString('hex');
}
