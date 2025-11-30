import { TonClient, Address } from '@ton/ton';
import * as utils from '../utils';
import type { Transfer } from '../types';

// Jetton transfer op codes
const JETTON_TRANSFER_OP = 0x0f8a7ea5; // transfer
const JETTON_TRANSFER_NOTIFICATION_OP = 0x7362d09c; // transfer_notification

// 從 jetton wallet 合約狀態中獲取 minter address
async function getMinterAddressFromWallet(
  client: TonClient,
  jettonWalletAddress: string
): Promise<string | null> {
  try {
    const walletAddr = Address.parse(jettonWalletAddress);
    const state = await client.getContractState(walletAddr);

    if (!state || !state.data) {
      return null;
    }

    // Jetton wallet 合約數據結構：
    // balance:Coins owner:MsgAddress minter:MsgAddress wallet_code:^Cell
    // state.data 可能是 Cell 或 Buffer，使用類型斷言處理
    const data = state.data as any;
    const cell = typeof data === 'object' && 'beginParse' in data ? data : null;

    if (!cell) {
      return null;
    }

    const slice = cell.beginParse();

    // 跳過 balance (Coins)
    slice.loadCoins();
    // 跳過 owner (MsgAddress)
    slice.loadAddress();
    // 讀取 minter (MsgAddress)
    const minterAddress = slice.loadAddress();

    return minterAddress.toString();
  } catch (error) {
    return null;
  }
}

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

  // `transaction.outMessages` 是一個字典結構，使用 values() 取出所有訊息
  const outMessages = Array.from(transaction.outMessages.values()) as any[];

  for (const msg of outMessages) {
    const info = msg?.info;

    if (info?.type !== 'internal') continue;

    const sourceAddress: string | undefined = info.src?.toString();
    const destinationAddress: string | undefined = info.dest?.toString();

    if (!sourceAddress || !destinationAddress) continue;

    // 檢查是否為 Jetton 轉帳
    const body = msg?.body;
    if (body && typeof body === 'object' && 'beginParse' in body) {
      try {
        const slice = body.beginParse();

        // 檢查是否有足夠的數據來讀取 op code
        if (slice.remainingBits >= 32) {
          // 讀取 op code (32 bits)
          const opCode = slice.loadUint(32);

          // 檢查是否為 Jetton transfer
          if (opCode === JETTON_TRANSFER_OP) {
            // Jetton transfer 結構：
            // op:uint32 query_id:uint64 amount:Coins destination:MsgAddress ...
            // 跳過 query_id (64 bits)
            if (slice.remainingBits >= 64) {
              slice.loadUint(64);
              // 讀取 amount (Coins)
              const jettonAmount = slice.loadCoins();

              // 從 jetton wallet 地址獲取 minter address
              const minterAddress = await getMinterAddressFromWallet(
                client,
                sourceAddress
              );

              return {
                source: sourceAddress,
                destination: destinationAddress,
                amount: jettonAmount.toString(),
                tokenAddress: minterAddress || undefined, // Jetton minter address
                transaction,
              };
            }
          } else if (opCode === JETTON_TRANSFER_NOTIFICATION_OP) {
            // transfer_notification 結構：
            // op:uint32 query_id:uint64 amount:Coins sender:MsgAddress ...
            // 跳過 query_id (64 bits)
            if (slice.remainingBits >= 64) {
              slice.loadUint(64);
              // 讀取 amount (Coins)
              const jettonAmount = slice.loadCoins();

              // 從 jetton wallet 地址獲取 minter address
              const minterAddress = await getMinterAddressFromWallet(
                client,
                sourceAddress
              );

              return {
                source: sourceAddress,
                destination: destinationAddress,
                amount: jettonAmount.toString(),
                tokenAddress: minterAddress || undefined, // Jetton minter address
                transaction,
              };
            }
          }
        }
      } catch (error) {
        // 如果解析失敗，繼續檢查原生 TON 轉帳
      }
    }

    // 檢查原生 TON 轉帳
    const coins: bigint | undefined = info.value?.coins;
    if (coins && coins > 0n) {
      return {
        source: sourceAddress,
        destination: destinationAddress,
        amount: coins.toString(),
        transaction,
      };
    }
  }

  // 如果沒有找到符合條件的 internal message，就視為沒有標準的轉帳
  return null;
}
