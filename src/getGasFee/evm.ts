import { TransactionReceipt } from 'ethers';

export function getGasFee(receipt: TransactionReceipt) {
  return (receipt.gasUsed * receipt.gasPrice).toString();
}
