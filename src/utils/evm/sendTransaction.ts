import { JsonRpcProvider, Wallet, TransactionResponse, Contract } from 'ethers';

export async function sendTransaction({
  privateKey,
  provider,
  destination,
  token_address,
  amount,
}: {
  privateKey: string;
  provider: JsonRpcProvider;
  destination: string;
  token_address?: string | null;
  amount: string;
}) {
  if (!provider) {
    throw new Error('Provider is required');
  }

  const signer = new Wallet(privateKey, provider);

  let tx: TransactionResponse;

  if (!token_address) {
    tx = await signer.sendTransaction({
      to: destination,
      value: amount,
    });
  } else {
    const contract = new Contract(
      token_address,
      [
        'function transfer(address to, uint256 amount) public returns (bool)',
      ],
      signer
    );
    if (!contract.transfer) {
      throw new Error(`Token contract not found: ${token_address}`);
    }

    tx = await contract.transfer(destination, amount);
  }

  await tx.wait();
  return tx.hash;
}