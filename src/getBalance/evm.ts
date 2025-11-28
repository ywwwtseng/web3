import { JsonRpcProvider, Contract } from 'ethers';
import { ERC20_ABI } from '../abi/ERC20_ABI';

export async function getBalance(
  provider: JsonRpcProvider,
  {
    address,
    tokenAddress,
  }: {
    address: string;
    tokenAddress?: string | null;
  }
): Promise<string> {
  if (tokenAddress) {
    const contract = new Contract(tokenAddress, ERC20_ABI, provider);
    const balance = await contract.balanceOf(address);
    return String(balance);
  } else {
    const balance = await provider.getBalance(address);
    return String(balance);
  }
}
