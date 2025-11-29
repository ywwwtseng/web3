import { TonClient } from '@ton/ton';
import * as utils from '../utils';
import type { Transfer } from '../types';

export async function getTransfer({
  client,
  source,
  hash,
}: {
  client: TonClient;
  source: string;
  hash: string;
}): Promise<Transfer | null> {
  const transaction = await utils.ton.waitForTransaction({
    client,
    hash,
    address: source,
    refetchLimit: 10,
    refetchInterval: 3000,
  });

  if (!transaction) {
    throw new Error('TON transaction not found');
  }

  // 目前我們只處理最常見的錢包轉帳情境：
  // 1. 這個交易是從 `address` 對外發送 TON
  // 2. 實際的轉帳資訊存在於 outMessages 的 internal message 中
  // 3. 我們取第一個 value.coins > 0 的 internal message 視為本次轉帳

  // `transaction.outMessages` 是一個字典結構，使用 values() 取出所有訊息
  const outMessages = Array.from(transaction.outMessages.values()) as any[];

  for (const msg of outMessages) {
    const info = msg?.info;

    if (info?.type !== 'internal') continue;

    const coins: bigint | undefined = info.value?.coins;
    if (!coins || coins <= 0n) continue;

    const source: string | undefined = info.src?.toString();
    const destination: string | undefined = info.dest?.toString();

    if (!source || !destination) continue;

    return {
      source,
      destination,
      amount: coins.toString(),
      transaction,
    };
  }

  // 如果沒有找到符合條件的 internal message，就視為沒有標準的轉帳
  return null;
}
