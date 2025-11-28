import { test, expect, describe } from 'bun:test';
import { Connection, PublicKey } from '@solana/web3.js';
import { TOKEN_2022_PROGRAM_ID } from '@solana/spl-token';
import { createTransaction } from './createTransaction';
import { decodeTransfer } from './decodeTransfer';
import { RPC_URL } from '../../constants';

describe('decodeTransfer', () => {
  test('decode Solana Transfer Transaction', async () => {
    const connection = new Connection(RPC_URL.SOLANA_DEV);
    const transaction = await createTransaction(connection, {
      feePayer: 'HSb2Krq5gAD8syfgwikbiF4iJzVXwxU41p6By34Zh5nK',
      source: 'HSb2Krq5gAD8syfgwikbiF4iJzVXwxU41p6By34Zh5nK',
      destination: 'Cn9yzV2kdCQRYNUYZ4KXeD5Z7DmevUkqixjv8eaYYXfk',
      amount: '1000000',
    });

    const latestBlockhash = await connection.getLatestBlockhash();
    transaction.feePayer = new PublicKey(
      '5g1QJWjSKuP2Pd2hbRffiSKPt7qgNvHgSN3m7nzRNbBM'
    );
    transaction.recentBlockhash = latestBlockhash.blockhash;
    transaction.lastValidBlockHeight = latestBlockhash.lastValidBlockHeight;

    const serialized = transaction
      .serialize({ requireAllSignatures: false })
      .toString('base64');

    const transter = await decodeTransfer(connection, serialized);

    expect(transter.source).toBe(
      'HSb2Krq5gAD8syfgwikbiF4iJzVXwxU41p6By34Zh5nK'
    );
    expect(transter.destination).toBe(
      'Cn9yzV2kdCQRYNUYZ4KXeD5Z7DmevUkqixjv8eaYYXfk'
    );
    expect(transter.amount).toBe('1000000');
  });

  test('decode USDC Transfer Transaction', async () => {
    const connection = new Connection(RPC_URL.SOLANA_DEV);
    const transaction = await createTransaction(connection, {
      feePayer: 'HSb2Krq5gAD8syfgwikbiF4iJzVXwxU41p6By34Zh5nK',
      source: 'HSb2Krq5gAD8syfgwikbiF4iJzVXwxU41p6By34Zh5nK',
      destination: 'Cn9yzV2kdCQRYNUYZ4KXeD5Z7DmevUkqixjv8eaYYXfk',
      amount: '1000000',
      mint: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
    });

    const latestBlockhash = await connection.getLatestBlockhash();
    transaction.feePayer = new PublicKey(
      'HSb2Krq5gAD8syfgwikbiF4iJzVXwxU41p6By34Zh5nK'
    );
    transaction.recentBlockhash = latestBlockhash.blockhash;
    transaction.lastValidBlockHeight = latestBlockhash.lastValidBlockHeight;

    const serialized = transaction
      .serialize({ requireAllSignatures: false })
      .toString('base64');

    const transter = await decodeTransfer(connection, serialized);

    expect(transter.source).toBe(
      'HSb2Krq5gAD8syfgwikbiF4iJzVXwxU41p6By34Zh5nK'
    );
    expect(transter.destination).toBe(
      'Cn9yzV2kdCQRYNUYZ4KXeD5Z7DmevUkqixjv8eaYYXfk'
    );
    expect(transter.amount).toBe('1000000');
  });

  test('decode PUMP Transfer Transaction', async () => {
    const connection = new Connection(RPC_URL.SOLANA_MAIN);
    const transaction = await createTransaction(connection, {
      feePayer: 'Cn9yzV2kdCQRYNUYZ4KXeD5Z7DmevUkqixjv8eaYYXfk',
      source: 'Cn9yzV2kdCQRYNUYZ4KXeD5Z7DmevUkqixjv8eaYYXfk',
      destination: '5g1QJWjSKuP2Pd2hbRffiSKPt7qgNvHgSN3m7nzRNbBM',
      amount: '1000000',
      mint: 'pumpCmXqMfrsAkQ5r49WcJnRayYRqmXz6ae8H7H9Dfn',
      tokenProgram: TOKEN_2022_PROGRAM_ID,
    });

    const latestBlockhash = await connection.getLatestBlockhash();
    transaction.feePayer = new PublicKey(
      'HSb2Krq5gAD8syfgwikbiF4iJzVXwxU41p6By34Zh5nK'
    );
    transaction.recentBlockhash = latestBlockhash.blockhash;
    transaction.lastValidBlockHeight = latestBlockhash.lastValidBlockHeight;

    const serialized = transaction
      .serialize({ requireAllSignatures: false })
      .toString('base64');

    const transter = await decodeTransfer(connection, serialized);

    expect(transter.source).toBe(
      'Cn9yzV2kdCQRYNUYZ4KXeD5Z7DmevUkqixjv8eaYYXfk'
    );
    expect(transter.destination).toBe(
      '5g1QJWjSKuP2Pd2hbRffiSKPt7qgNvHgSN3m7nzRNbBM'
    );
    expect(transter.amount).toBe('1000000');
  });
});
