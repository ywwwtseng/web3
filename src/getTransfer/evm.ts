import {
  TransactionReceipt,
  TransactionResponse,
  JsonRpcProvider,
  Interface,
} from 'ethers';
import type { Transfer } from '../types';
import { ERC20_ABI } from '../abi/ERC20_ABI';

const transferIface = new Interface(ERC20_ABI);

export async function getTransfer({
  provider,
  receipt,
}: {
  provider: JsonRpcProvider;
  receipt: string | TransactionReceipt;
}): Promise<Transfer | null> {
  if (typeof receipt === 'string') {
    receipt = await provider.getTransactionReceipt(receipt);
  }

  if (receipt.status !== 1) {
    return null;
  }

  const transaction = await provider.getTransaction(receipt.hash);

  if (
    transaction.value &&
    transaction.value > 0n &&
    receipt.logs.length === 0
  ) {
    return {
      source: transaction.from,
      destination: transaction.to,
      amount: transaction.value.toString(),
    };
  }

  for (const log of receipt.logs) {
    try {
      const parsed = transferIface.parseLog(log);
      if (parsed?.name === 'Transfer') {
        const tokenAddress = log.address;
        const rawAmount = parsed.args.value as bigint;

        return {
          source: parsed.args.from,
          destination: parsed.args.to,
          amount: rawAmount.toString(),
          tokenAddress,
        };
      }
    } catch (err) {
      // ignore non-Transfer event
    }
  }

  return null;
}
