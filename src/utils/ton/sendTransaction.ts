import {
  Address,
  beginCell,
  external,
  internal,
  SendMode,
  storeMessage,
  TonClient,
  Cell,
} from '@ton/ton';
import TonWeb from 'tonweb';
import { createWalletContractV5R1 } from './createWalletContractV5R1';
import { getJettonWalletAddress } from './getJettonWalletAddress';
import { createTransferBody } from './createTransferBody';

export async function sendTransaction({
  client,
  minterAddress,
  privateKey,
  destination,
  amount,
  // carryAllRemainingBalance = false,
}: {
  client: TonClient;
  minterAddress?: string;
  privateKey: string;
  destination: string;
  amount: string;
  /**
   * 是否發送所有餘額（清空賬戶）
   * - true: 使用 CARRY_ALL_REMAINING_BALANCE，發送所有剩餘餘額（會自動保留 gas 費用）
   * - false: 發送指定金額
   * 注意：當 carryAllRemainingBalance 為 true 時，amount 參數會被忽略
   */
  // carryAllRemainingBalance?: boolean;
}) {
  const { contract, address } = await createWalletContractV5R1({
    client,
    privateKey,
  });

  const seqno: number = await contract.getSeqno();

  let transfer: Cell;
  let sendMode: number = SendMode.PAY_GAS_SEPARATELY + SendMode.IGNORE_ERRORS;

  // 計算 SendMode
  // if (carryAllRemainingBalance && !minterAddress) {
  //   // 清空餘額模式：使用 CARRY_ALL_REMAINING_BALANCE
  //   // 這會發送所有剩餘餘額，自動保留 gas 費用
  //   sendMode = SendMode.CARRY_ALL_REMAINING_BALANCE;
  // }

  if (minterAddress) {
    // 獲取發送者的 jetton wallet 地址（從這裡發送 jetton）
    const senderJettonWalletAddress = await getJettonWalletAddress({
      minterAddress,
      ownerAddress: address,
      client,
    });

    transfer = contract.createTransfer({
      seqno,
      secretKey: Buffer.from(privateKey, 'hex'),
      sendMode,
      messages: [
        internal({
          to: Address.parse(senderJettonWalletAddress), // 發送到發送者的 jetton wallet
          value: BigInt(TonWeb.utils.toNano('0.05').toString()), // 用於支付 gas 和轉帳費用
          body: createTransferBody({
            tokenAmount: amount,
            toAddress: destination,
            responseAddress: destination,
          }), // Cell 類型
        }),
      ],
    });
  } else {
    // 原生 TON 轉帳
    transfer = contract.createTransfer({
      seqno,
      secretKey: Buffer.from(privateKey, 'hex'),
      sendMode,
      messages: [
        internal({
          to: Address.parse(destination),
          // value: carryAllRemainingBalance
          //   ? BigInt(0) // 當 sendAllBalance 為 true 時，value 設為 0，由 SendMode 處理
          //   : BigInt(amount),
          value: BigInt(amount),
        }),
      ],
    });
  }

  // External message 的 to 必須是發送者的錢包地址，不是 jetton wallet
  const externalMessage = external({
    to: Address.parse(address), // 發送者的錢包地址
    init: null,
    body: transfer,
  });

  // 創建外部消息來觸發錢包合約
  // 創建外部消息的 BOC 並發送
  const externalMessageBoc = beginCell()
    .store(storeMessage(externalMessage))
    .endCell()
    .toBoc();

  await client.sendFile(externalMessageBoc);

  // 返回實際的 inMessage hash（用於 waitForTransaction 匹配）
  // 這個 hash 會與交易中的 inMessage hash 匹配
  const inMessageHash = beginCell()
    .store(storeMessage(externalMessage))
    .endCell()
    .hash()
    .toString('hex');

  return inMessageHash;
}
