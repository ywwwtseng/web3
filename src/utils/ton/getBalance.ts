import TonWeb from 'tonweb';
import { getJettonWalletAddress } from './getJettonWalletAddress';

export const getBalance = async ({
  provider,
  tokenAddress,
  address,
}: {
  provider?: InstanceType<typeof TonWeb.HttpProvider>;
  tokenAddress?: string;
  address: string;
}): Promise<string> => {
  const tonweb = new TonWeb(provider ?? new TonWeb.HttpProvider());

  if (tokenAddress) {
    const jettonWalletAddress = await getJettonWalletAddress({
      minterAddress: tokenAddress,
      ownerAddress: address,
    });

    const jettonWallet = new TonWeb.token.jetton.JettonWallet(tonweb.provider, {
      address: jettonWalletAddress,
    });

    const data = await jettonWallet.getData();
    return data.balance.toString();
  } else {
    const balance = await tonweb.getBalance(address);
    return balance;
  }
};
