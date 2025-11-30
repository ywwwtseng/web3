import TonWeb from 'tonweb';
import { beginCell, Address } from '@ton/ton';

export function createTransferBody({
  tokenAmount,
  toAddress,
}: {
  tokenAmount: string;
  toAddress: string;
}) {
  return beginCell()
    .storeUint(0xf8a7ea5, 32)
    .storeUint(0, 64)
    .storeCoins(new TonWeb.utils.BN(tokenAmount)) // amount
    .storeAddress(Address.parse(toAddress)) // to address
    .storeAddress(Address.parse(toAddress)) // response address
    .storeMaybeRef(null)
    .storeCoins(TonWeb.utils.toNano('0'))
    .storeMaybeRef(null)
    .endCell()
    .toBoc()
    .toString('base64');
}
