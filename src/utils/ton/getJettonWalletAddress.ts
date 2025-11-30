import TonWeb from 'tonweb';
import { TonClient, JettonMaster, Address } from '@ton/ton';

export async function getJettonWalletAddress({
  minterAddress,
  ownerAddress,
  client,
}: {
  minterAddress: string;
  ownerAddress: string;
  client?: TonClient;
}) {
  if (client) {
    const jettonMaster = client.open(
      JettonMaster.create(Address.parse(minterAddress))
    );

    const walletAddress = await jettonMaster.getWalletAddress(
      Address.parse(ownerAddress)
    );

    return walletAddress.toString({
      urlSafe: true,
      bounceable: false,
    });
  } else {
    const tonweb = new TonWeb();

    // Jetton API 應該從 TonWeb.token 取得（靜態）
    const JettonMinter = TonWeb.token.jetton.JettonMinter;

    // To construct JettonMinter, we must include all required JettonMinterOptions fields
    // Use dummy/default values as the actual on-chain state will be read;
    const minter = new JettonMinter(tonweb.provider, {
      address: new TonWeb.utils.Address(minterAddress),
      adminAddress: new TonWeb.utils.Address(
        'EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c'
      ), // dummy zero address
      jettonContentUri: '',
      jettonWalletCodeHex: '', // dummy
    });

    const walletAddress = await minter.getJettonWalletAddress(
      new TonWeb.utils.Address(ownerAddress)
    );

    return walletAddress.toString(true, true, true, false);
  }
}
