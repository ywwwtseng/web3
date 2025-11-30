import {
  TonClient,
  Address,
  beginCell,
  storeMessage,
  Transaction,
} from '@ton/ton';

export async function waitForTransaction({
  client,
  hash,
  refetchInterval = 1000,
  refetchLimit,
  address,
}: {
  client: TonClient;
  hash: string;
  refetchInterval?: number;
  refetchLimit?: number;
  address: string;
}): Promise<Transaction | null> {
  return new Promise((resolve) => {
    let refetches = 0;
    const walletAddress = Address.parse(address);
    let lastCheckedLt: bigint | null = null;

    const interval = setInterval(async () => {
      try {
        refetches += 1;
        const state = await client.getContractState(walletAddress);
        if (!state || !state.lastTransaction) {
          if (refetchLimit && refetches >= refetchLimit) {
            clearInterval(interval);
            resolve(null);
          }
          return;
        }

        const lastLt = state.lastTransaction.lt;
        const lastHash = state.lastTransaction.hash;

        // 如果這是最後一筆交易且已經檢查過，跳過
        if (
          lastCheckedLt !== null &&
          BigInt(lastLt.toString()) === lastCheckedLt
        ) {
          if (refetchLimit && refetches >= refetchLimit) {
            clearInterval(interval);
            resolve(null);
          }
          return;
        }

        // 檢查最後一筆交易
        const lastTx = await client.getTransaction(
          walletAddress,
          lastLt,
          lastHash
        );

        if (lastTx && lastTx.inMessage) {
          const msgCell = beginCell()
            .store(storeMessage(lastTx.inMessage))
            .endCell();
          const inMsgHash = msgCell.hash().toString('hex');

          if (inMsgHash === hash) {
            clearInterval(interval);
            resolve(lastTx);
            return;
          }
        }

        lastCheckedLt = BigInt(lastLt.toString());

        if (refetchLimit && refetches >= refetchLimit) {
          clearInterval(interval);
          resolve(null);
        }
      } catch (error) {
        // 如果發生錯誤，繼續重試
        if (refetchLimit && refetches >= refetchLimit) {
          clearInterval(interval);
          resolve(null);
        }
      }
    }, refetchInterval);
  });
}
