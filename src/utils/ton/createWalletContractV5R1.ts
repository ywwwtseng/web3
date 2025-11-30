import { OpenedContract, TonClient, WalletContractV5R1 } from '@ton/ton';
import TonWeb from 'tonweb';

export async function createWalletContractV5R1({
  client,
  privateKey,
}: {
  client: TonClient;
  privateKey: string;
}): Promise<{
  address: string;
  contract: OpenedContract<WalletContractV5R1>;
  state: 'active' | 'uninitialized' | 'frozen';
}> {
  const keyPair = TonWeb.utils.nacl.sign.keyPair.fromSecretKey(
    Buffer.from(privateKey, 'hex')
  );

  const publicKey = Buffer.from(keyPair.publicKey);

  const wallet = WalletContractV5R1.create({
    workchain: 0,
    publicKey,
  });

  const contract = client.open(wallet);
  const account = await client.getContractState(wallet.address);
  const address = wallet.address.toString({ urlSafe: true, bounceable: false });

  return {
    address,
    state: account.state,
    contract,
  };
}
