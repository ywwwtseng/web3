import { TonClient } from '@ton/ton';
import TonWeb from 'tonweb';
import type { Transfer } from '../../types';
import { waitForTransaction } from './waitForTransaction';
import { JETTON_TRANSFER_OP } from './constants';

export async function getTransfer({
  client,
  source,
  hash,
}: {
  client: TonClient;
  source: string;
  hash: string;
}): Promise<Transfer | null> {
  const transaction = await waitForTransaction({
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
            // op:uint32 query_id:uint64 amount:Coins destination:MsgAddress response_destination:MsgAddress ...
            // 跳過 query_id (64 bits)
            if (slice.remainingBits >= 64) {
              slice.loadUint(64);
              // 讀取 amount (Coins)
              const jettonAmount = slice.loadCoins();
              // 讀取 destination (接收者的用戶地址，不是 jetton wallet 地址)
              const receiverAddress = slice.loadAddress();

              const jettonWallet = new TonWeb.token.jetton.JettonWallet(
                new TonWeb.HttpProvider(),
                {
                  address: destinationAddress,
                }
              );

              const data = await jettonWallet.getData();

              return {
                source: sourceAddress, // 發送者的用戶地址
                destination: receiverAddress.toString(), // 接收者的用戶地址
                amount: jettonAmount.toString(),
                tokenAddress: data.jettonMinterAddress.toString(
                  true,
                  true,
                  true,
                  false
                ), // Jetton minter address
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
