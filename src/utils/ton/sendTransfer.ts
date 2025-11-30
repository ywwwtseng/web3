import {
  Address,
  beginCell,
  external,
  internal,
  SendMode,
  storeMessage,
  Message,
  TonClient,
} from '@ton/ton';
import TonWeb from 'tonweb';
import { createWalletContractV5R1 } from './createWalletContractV5R1';
import { getNormalizedExtMessageHash } from './getNormalizedExtMessageHash';
import { getJettonWalletAddress } from './getJettonWalletAddress';
import { createTransferBody } from './createTransferBody';

export async function sendTransfer({
  client,
  minterAddress,
  privateKey,
  destination,
  amount,
}: {
  client: TonClient;
  minterAddress?: string;
  privateKey: string;
  destination: string;
  amount: string;
}) {
  const { contract, address } = await createWalletContractV5R1({
    client,
    privateKey,
  });

  const seqno: number = await contract.getSeqno();

  let externalMessage: Message;

  if (minterAddress) {
    // 獲取發送者的 jetton wallet 地址（從這裡發送 jetton）
    const senderJettonWalletAddress = await getJettonWalletAddress(
      minterAddress,
      address
    );

    // 獲取接收者的 jetton wallet 地址
    const receiverJettonWalletAddress = await getJettonWalletAddress(
      minterAddress,
      destination
    );

    const transfer = contract.createTransfer({
      seqno,
      secretKey: Buffer.from(privateKey, 'hex'),
      sendMode: SendMode.PAY_GAS_SEPARATELY + SendMode.IGNORE_ERRORS,
      messages: [
        internal({
          to: Address.parse(senderJettonWalletAddress), // 發送到發送者的 jetton wallet
          value: BigInt(TonWeb.utils.toNano('0.05').toString()), // 用於支付 gas 和轉帳費用
          body: createTransferBody({
            tokenAmount: amount,
            toAddress: receiverJettonWalletAddress,
            responseAddress: address,
          }), // Cell 類型
        }),
      ],
    });

    // External message 的 to 必須是發送者的錢包地址，不是 jetton wallet
    externalMessage = external({
      to: Address.parse(address), // 發送者的錢包地址
      init: null,
      body: transfer,
    });
  } else {
    // 原生 TON 轉帳
    const transfer = contract.createTransfer({
      seqno,
      secretKey: Buffer.from(privateKey, 'hex'),
      sendMode: SendMode.PAY_GAS_SEPARATELY + SendMode.IGNORE_ERRORS,
      messages: [
        internal({
          to: Address.parse(destination),
          value: BigInt(amount),
        }),
      ],
    });

    externalMessage = external({
      to: Address.parse(address),
      init: null,
      body: transfer,
    });
  }

  // 創建外部消息來觸發錢包合約
  // 獲取標準化的外部消息 hash
  const normalizedExtHash =
    getNormalizedExtMessageHash(externalMessage).toString('hex');

  // 創建外部消息的 BOC 並發送
  const externalMessageBoc = beginCell()
    .store(storeMessage(externalMessage))
    .endCell()
    .toBoc();

  await client.sendFile(externalMessageBoc);

  return normalizedExtHash;
}
