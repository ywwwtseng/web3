import { Connection, PublicKey } from '@solana/web3.js';
import { createTransaction } from './createTransaction';
import { KeyPair } from './KeyPair';

export async function sendTransaction({
  privateKey,
  connection,
  source,
  destination,
  token,
  amount,
}: {
  privateKey: string;
  connection: Connection;
  source: string;
  destination: string;
  token?: {
    token_address: string;
    token_program: string;
  };
  amount: string;
}) {
  const transaction = await createTransaction(
    connection,
    {
      feePayer: source,
      source,
      destination,
      mint: token?.token_address,
      amount,
      tokenProgram: token?.token_program,
    }
  );

  const latestBlockhash = await connection.getLatestBlockhash('finalized');
  transaction.feePayer = new PublicKey(source);
  transaction.recentBlockhash = latestBlockhash.blockhash;
  transaction.lastValidBlockHeight = latestBlockhash.lastValidBlockHeight;

  // 从 privateKey 创建密钥对
  const keypair = KeyPair.from(privateKey);

  // 签名交易
  // transaction.sign() 会自动为所有需要的账户签名
  // 如果 keypair 的 publicKey 在交易的 signers 列表中，它就会被签名
  transaction.sign(keypair);

  // 发送交易
  const signature = await connection.sendRawTransaction(
    transaction.serialize(),
    {
      skipPreflight: false,
      maxRetries: 3,
    }
  );

  return signature;
}