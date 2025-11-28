import { JsonRpcProvider } from 'ethers';
import { Wallet } from 'ethers';
import { Contract } from 'ethers';
import { ERC20_ABI } from '../../abi/ERC20_ABI';

export async function estimateFee({
  provider,
  tokenAddress,
  signer,
  destination,
  amount,
}: {
  provider: JsonRpcProvider;
  tokenAddress?: string;
  signer?: Wallet;
  destination?: string;
  amount?: string | bigint;
}) {
  const feeData = await provider.getFeeData();

  if (!tokenAddress) {
    const gasLimit = 21000n;
    return (feeData.gasPrice * gasLimit).toString();
  } else {
    if (!signer) {
      throw new Error('Signer is required');
    }

    if (!destination) {
      throw new Error('Destination is required');
    }

    if (!amount) {
      throw new Error('Amount is required');
    }

    const contract = new Contract(tokenAddress, ERC20_ABI, signer);

    const gasLimit = await contract.transfer.estimateGas(
      destination,
      typeof amount === 'string' ? BigInt(amount) : amount
    );

    return (feeData.gasPrice * gasLimit).toString();
  }
}
