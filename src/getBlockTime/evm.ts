import { JsonRpcProvider, TransactionReceipt } from 'ethers';

export async function getBlockTime({
  provider,
  receipt,
}: {
  provider: JsonRpcProvider;
  receipt: TransactionReceipt;
}) {
  const block = await provider.getBlock(receipt.blockNumber);
  return block.timestamp;
}
