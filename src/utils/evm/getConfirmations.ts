import { JsonRpcProvider, TransactionReceipt } from 'ethers';

/**
 * 等待交易達到指定確認數（不自行輪詢，直接使用 provider.waitForTransaction）。
 */
export async function getConfirmations({
  provider,
  hash,
}: {
  provider: JsonRpcProvider;
  hash: string;
}): Promise<number> {
  try {
  const receipt = await provider.getTransactionReceipt(hash);

    if (!receipt) {
      return 0;
    }

    const currentBlock = await provider.getBlockNumber();
    return Number(currentBlock) - Number(receipt.blockNumber) + 1;
  } catch {
    return 0;
  }
}
