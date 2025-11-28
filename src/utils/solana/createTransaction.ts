import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
} from '@solana/web3.js';
import {
  getMint,
  getAssociatedTokenAddressSync,
  createTransferInstruction,
  createTransferCheckedInstruction,
  createAssociatedTokenAccountInstruction,
  TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { BN } from '@project-serum/anchor';

/**
 * 从链上查询 mint 账户，自动检测是标准 Token 还是 Token 2022
 */
async function detectTokenProgram(
  connection: Connection,
  mintAddress: string | PublicKey
): Promise<typeof TOKEN_PROGRAM_ID | typeof TOKEN_2022_PROGRAM_ID> {
  const mint = new PublicKey(mintAddress);
  const mintInfo = await connection.getAccountInfo(mint);

  if (!mintInfo) {
    throw new Error(`Mint account not found: ${mintAddress}`);
  }

  // 检查 owner 是否为 TOKEN_2022_PROGRAM_ID
  if (mintInfo.owner.equals(TOKEN_2022_PROGRAM_ID)) {
    return TOKEN_2022_PROGRAM_ID;
  }

  // 默认使用标准 Token 程序
  return TOKEN_PROGRAM_ID;
}

export async function hasATA(
  connection: Connection,
  mintAddress: string | PublicKey,
  ownerAddress: string | PublicKey,
  tokenProgram: typeof TOKEN_PROGRAM_ID | typeof TOKEN_2022_PROGRAM_ID
) {
  const ata = getAssociatedTokenAddressSync(
    new PublicKey(mintAddress),
    new PublicKey(ownerAddress),
    false,
    tokenProgram,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );

  const accountInfo = await connection.getAccountInfo(ata);
  return accountInfo !== null; // true = 已存在
}

export function createATAInstruction(
  payer: PublicKey,
  mint: PublicKey,
  owner: PublicKey,
  tokenProgram: typeof TOKEN_PROGRAM_ID | typeof TOKEN_2022_PROGRAM_ID
) {
  const ata = getAssociatedTokenAddressSync(
    mint,
    owner,
    false,
    tokenProgram,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );

  return createAssociatedTokenAccountInstruction(
    payer, // 誰出 SOL 來建 ATA
    ata, // ATA 地址
    owner, // ATA 的持有者 (接收方)
    mint, // Token Mint
    tokenProgram,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );
}

export async function createSolanaTransaction({
  source,
  destination,
  amount,
}: {
  source: string | PublicKey;
  destination: string | PublicKey;
  amount: bigint | string | number;
}) {
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: new PublicKey(source),
      toPubkey: new PublicKey(destination),
      lamports: Number(amount),
    })
  );

  // transaction.feePayer = new PublicKey(feePayer);
  // transaction.recentBlockhash = (
  //   await connection.getLatestBlockhash()
  // ).blockhash;

  return transaction;
}

export async function createSPLTransaction(
  connection: Connection,
  {
    feePayer,
    source,
    destination,
    amount,
    mint,
    tokenProgram,
  }: {
    feePayer: string | PublicKey;
    source: string | PublicKey;
    destination: string | PublicKey;
    amount: bigint | string | number;
    mint: string | PublicKey;
    tokenProgram?: string | PublicKey | null;
  }
) {
  // 如果 tokenProgram 未提供，从链上自动检测

  if (tokenProgram) {
    // 根据 tokenProgram 选择使用标准 Token 还是 Token 2022
    tokenProgram = new PublicKey(tokenProgram).equals(TOKEN_2022_PROGRAM_ID)
      ? TOKEN_2022_PROGRAM_ID
      : TOKEN_PROGRAM_ID;
  } else {
    // 自动从链上检测
    tokenProgram = await detectTokenProgram(connection, mint);
  }

  const mintInfo = await getMint(
    connection,
    new PublicKey(mint),
    'confirmed',
    tokenProgram // TOKEN_PROGRAM_ID or TOKEN_2022_PROGRAM_ID
  );

  const fromPayerATA = getAssociatedTokenAddressSync(
    new PublicKey(mint),
    new PublicKey(source),
    false,
    tokenProgram,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );

  const hasRecipientATA = await hasATA(
    connection,
    mint,
    destination,
    tokenProgram
  );

  const instructions = [];

  if (!hasRecipientATA) {
    instructions.push(
      createATAInstruction(
        new PublicKey(feePayer),
        new PublicKey(mint),
        new PublicKey(destination),
        tokenProgram
      )
    );
  }

  const recipientATA = getAssociatedTokenAddressSync(
    new PublicKey(mint),
    new PublicKey(destination),
    false,
    tokenProgram,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );

  if (tokenProgram.equals(TOKEN_2022_PROGRAM_ID)) {
    instructions.push(
      createTransferCheckedInstruction(
        fromPayerATA,
        new PublicKey(mint),
        recipientATA,
        new PublicKey(source),
        new BN(amount),
        mintInfo.decimals,
        [],
        TOKEN_2022_PROGRAM_ID
      )
    );
  } else {
    instructions.push(
      createTransferInstruction(
        fromPayerATA,
        recipientATA,
        new PublicKey(source),
        Number(amount),
        [],
        TOKEN_PROGRAM_ID
      )
    );
  }

  const transaction = new Transaction().add(...instructions);

  // transaction.feePayer = new PublicKey(feePayer);
  // transaction.recentBlockhash = (
  //   await connection.getLatestBlockhash()
  // ).blockhash;

  return transaction;
}

export interface CreateTransactionParams {
  feePayer: string | PublicKey;
  source: string | PublicKey;
  destination: string | PublicKey;
  amount: bigint | string | number;
  mint?: string | PublicKey | null;
  tokenProgram?: string | PublicKey | null;
}

export function createTransaction(
  connection: Connection,
  {
    feePayer,
    source,
    destination,
    amount,
    mint,
    tokenProgram,
  }: CreateTransactionParams
) {
  if (mint) {
    return createSPLTransaction(connection, {
      feePayer,
      source,
      destination,
      amount,
      mint,
      tokenProgram,
    });
  } else {
    return createSolanaTransaction({
      source,
      destination,
      amount,
    });
  }
}
