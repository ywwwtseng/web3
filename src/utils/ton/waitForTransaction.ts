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
    const interval = setInterval(async () => {
      refetches += 1;
      const state = await client.getContractState(walletAddress);
      if (!state || !state.lastTransaction) {
        clearInterval(interval);
        resolve(null);
        return;
      }
      const lastLt = state.lastTransaction.lt;
      const lastHash = state.lastTransaction.hash;
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
        }
      }
      if (refetchLimit && refetches >= refetchLimit) {
        clearInterval(interval);
        resolve(null);
      }
    }, refetchInterval);
  });
}
