import { JsonRpcProvider, TransactionReceipt } from 'ethers';

export async function waitForTransaction({
  provider,
  hash,
  refetchInterval = 1000,
  refetchLimit,
}: {
  provider: JsonRpcProvider;
  hash: string;
  refetchInterval?: number;
  refetchLimit?: number;
}): Promise<TransactionReceipt | null> {
  return new Promise((resolve) => {
    let refetches = 0;
    const interval = setInterval(async () => {
      refetches += 1;

      try {
        const receipt = await provider.getTransactionReceipt(hash);

        // 如果交易收據存在，表示交易已確認，返回收據
        if (receipt) {
          clearInterval(interval);
          resolve(receipt);
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
