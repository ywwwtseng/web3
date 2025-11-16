import {
  SystemProgram,
  Transaction,
  SystemInstruction,
  Connection,
} from '@solana/web3.js';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
  decodeTransferInstruction,
  decodeTransferCheckedInstruction,
} from '@solana/spl-token';
import { getAccountInfo } from './getAccountInfo';
import type { Transfer } from './../types';

export async function decodeTransfer(
  connection: Connection,
  base64: string
): Promise<Transfer> {
  const tx = Transaction.from(Buffer.from(base64, 'base64'));

  if (tx.instructions.length === 1) {
    if (tx.instructions[0].programId.equals(SystemProgram.programId)) {
      const ix = tx.instructions[0];

      const parsed = SystemInstruction.decodeTransfer(ix);
      const source = parsed.fromPubkey.toBase58();
      const destination = parsed.toPubkey.toBase58();
      const amount = parsed.lamports.toString();

      return {
        source,
        destination,
        amount,
      };
    } else if (tx.instructions[0].programId.equals(TOKEN_PROGRAM_ID)) {
      const ix = tx.instructions[0];
      const parsed = decodeTransferInstruction(ix); // 用 spl-token helper
      const amount = parsed.data.amount.toString();

      const sourceInfo = await getAccountInfo(
        connection,
        parsed.keys.source.pubkey
      );

      const destinationInfo = await getAccountInfo(
        connection,
        parsed.keys.destination.pubkey
      );

      return {
        source: sourceInfo.owner,
        destination: destinationInfo.owner,
        amount,
        tokenAddress: sourceInfo.mint,
      };
    } else if (tx.instructions[0].programId.equals(TOKEN_2022_PROGRAM_ID)) {
      const ix = tx.instructions[0];
      const parsed = decodeTransferCheckedInstruction(
        ix,
        TOKEN_2022_PROGRAM_ID
      );

      const amount = parsed.data.amount.toString();

      const sourceInfo = await getAccountInfo(
        connection,
        parsed.keys.source.pubkey
      );

      const destinationInfo = await getAccountInfo(
        connection,
        parsed.keys.destination.pubkey
      );

      return {
        source: sourceInfo.owner,
        destination: destinationInfo.owner,
        amount,
        tokenAddress: sourceInfo.mint,
      };
    }
  } else if (tx.instructions.length === 2) {
    const cata_ix = tx.instructions.find((ix) =>
      ix.programId.equals(ASSOCIATED_TOKEN_PROGRAM_ID)
    );

    let ix = tx.instructions.find((ix) =>
      ix.programId.equals(TOKEN_PROGRAM_ID)
    );

    if (ix) {
      // SPL Token transfer (标准 Token 或 Token 2022)
      const parsed = decodeTransferInstruction(ix); // 用 spl-token helper
      const amount = parsed.data.amount.toString();

      const sourceInfo = await getAccountInfo(
        connection,
        parsed.keys.source.pubkey
      );

      return {
        source: sourceInfo.owner,
        destination: cata_ix.keys[2].pubkey.toBase58(),
        amount,
        tokenAddress: sourceInfo.mint,
      };
    }

    ix = tx.instructions.find((ix) =>
      ix.programId.equals(TOKEN_2022_PROGRAM_ID)
    );

    if (ix) {
      const parsed = decodeTransferCheckedInstruction(
        ix,
        TOKEN_2022_PROGRAM_ID
      );

      const amount = parsed.data.amount.toString();

      const sourceInfo = await getAccountInfo(
        connection,
        parsed.keys.source.pubkey
      );

      return {
        source: sourceInfo.owner,
        destination: cata_ix.keys[2].pubkey.toBase58(),
        amount,
        tokenAddress: sourceInfo.mint,
      };
    }
  }

  throw new Error('Invalid transfer transaction');
}
