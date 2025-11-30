import TonWeb from 'tonweb';
import { beginCell, Address } from '@ton/ton';
import { JETTON_TRANSFER_OP } from './constants';

export function createTransferBody({
  tokenAmount,
  toAddress,
  responseAddress,
}: {
  tokenAmount: string;
  toAddress: string;
  responseAddress: string;
}) {
  return beginCell()
    .storeUint(JETTON_TRANSFER_OP, 32) // JETTON_TRANSFER_OP
    .storeUint(0, 64) // query_id
    .storeCoins(BigInt(tokenAmount)) // jetton amount
    .storeAddress(Address.parse(toAddress)) // destination: 接收者的 jetton wallet
    .storeAddress(Address.parse(responseAddress)) // response_destination: 發送者的用戶地址
    .storeMaybeRef(null) // custom_payload
    .storeCoins(TonWeb.utils.toNano('0')) // forward_ton_amount
    .storeMaybeRef(null) // forward_payload
    .endCell();
}
