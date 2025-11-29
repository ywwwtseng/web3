import { Connection, ParsedTransactionWithMeta } from '@solana/web3.js';

export async function waitForTransaction({
  connection,
  signature,
  refetchInterval = 1000,
  refetchLimit,
}: {
  connection: Connection;
  signature: string;
  refetchInterval?: number;
  refetchLimit?: number;
}): Promise<ParsedTransactionWithMeta | null> {
  return new Promise((resolve) => {
    let refetches = 0;
    const interval = setInterval(async () => {
      refetches += 1;

      try {
        const transaction = await connection.getParsedTransaction(signature, {
          maxSupportedTransactionVersion: 0,
          commitment: 'finalized',
        });

        // 如果交易存在且已確認，返回交易
        if (transaction) {
          clearInterval(interval);
          resolve(transaction);
          return;
        }
      } catch (error) {
        // 如果查詢失敗，繼續輪詢
        // 可能是交易還未確認或網絡問題
      }

      // 如果達到重試次數限制，返回 null
      if (refetchLimit && refetches >= refetchLimit) {
        clearInterval(interval);
        resolve(null);
      }
    }, refetchInterval);
  });
}
