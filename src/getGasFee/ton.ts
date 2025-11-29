import { Transaction } from '@ton/ton';

export function getGasFee(transaction: Transaction) {
  let gasFee = 0n;
  let forwardFee = 0n;

  // 1. computePhase → gas fee
  if (transaction.description.type === 'generic') {
    const compute = transaction.description.computePhase;
    if (compute && compute.type === 'vm') {
      gasFee = BigInt(compute.gasUsed ?? 0);
    }

    // 2. actionPhase → forward_fee（主要是轉帳/合約呼叫會有）
    const action = transaction.description.actionPhase;
    if (action) {
      forwardFee = BigInt(action.totalFwdFees ?? 0);
    }
  }

  const totalFee = gasFee + forwardFee;

  return totalFee.toString();
}
