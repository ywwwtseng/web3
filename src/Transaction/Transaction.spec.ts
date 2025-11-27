import { test, expect, describe } from 'bun:test';
import crypto from 'crypto';
import { TOKEN_2022_PROGRAM_ID } from '@solana/spl-token';
import { Transaction, solana, ethers, RPC_URL, KeyVaultService } from '..';
import { wallet } from '../config/wallet';
import { NETWORKS } from '../constants';

describe('Transaction', () => {
  test('get Solana Parsed Transaction', async () => {
    const connection = new solana.Connection(RPC_URL.SOLANA_DEV);
    const transaction = await Transaction.solana.get(connection, {
      signature:
        '295q29VLXDbL4TkvNmxSqfX6i1B1nQhXu4U9ZZc2xkFp5U1cniPmGDfugaMNpGMyJPk4fPGd7e9PJZjpJU8KjK6K',
    });
    expect(transaction).toBeDefined();
  });

  test('get EVM Transaction Receipt', async () => {
    const provider = new ethers.JsonRpcProvider(RPC_URL.BSC);
    const transaction = await Transaction.evm.getReceipt(
      provider,
      '0xc5bfb0ac331e117206d7a523e0e2915601f18761d6717f5e0a451bad406d12aa'
    );

    expect(transaction).toBeDefined();
  });

  test('decode Solana Transfer Transaction', async () => {
    const connection = new solana.Connection(RPC_URL.SOLANA_DEV);
    const transaction = await Transaction.solana.create(connection, {
      feePayer: wallet.solana.publicKey,
      source: wallet.solana.publicKey,
      destination: 'Cn9yzV2kdCQRYNUYZ4KXeD5Z7DmevUkqixjv8eaYYXfk',
      amount: '1000000',
    });

    const latestBlockhash = await connection.getLatestBlockhash();
    transaction.feePayer = new solana.PublicKey(
      '5g1QJWjSKuP2Pd2hbRffiSKPt7qgNvHgSN3m7nzRNbBM'
    );
    transaction.recentBlockhash = latestBlockhash.blockhash;
    transaction.lastValidBlockHeight = latestBlockhash.lastValidBlockHeight;

    const serialized = transaction
      .serialize({ requireAllSignatures: false })
      .toString('base64');

    const transter = await Transaction.solana.decodeTransfer(
      connection,
      serialized
    );

    expect(transter.source).toBe(wallet.solana.publicKey);
    expect(transter.destination).toBe(
      'Cn9yzV2kdCQRYNUYZ4KXeD5Z7DmevUkqixjv8eaYYXfk'
    );
    expect(transter.amount).toBe('1000000');
  });

  test('decode USDC Transfer Transaction', async () => {
    const connection = new solana.Connection(RPC_URL.SOLANA_DEV);
    const transaction = await Transaction.solana.create(connection, {
      feePayer: wallet.solana.publicKey,
      source: wallet.solana.publicKey,
      destination: 'Cn9yzV2kdCQRYNUYZ4KXeD5Z7DmevUkqixjv8eaYYXfk',
      amount: '1000000',
      mint: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
    });

    const latestBlockhash = await connection.getLatestBlockhash();
    transaction.feePayer = new solana.PublicKey(wallet.solana.publicKey);
    transaction.recentBlockhash = latestBlockhash.blockhash;
    transaction.lastValidBlockHeight = latestBlockhash.lastValidBlockHeight;

    const serialized = transaction
      .serialize({ requireAllSignatures: false })
      .toString('base64');

    const transter = await Transaction.solana.decodeTransfer(
      connection,
      serialized
    );

    expect(transter.source).toBe(wallet.solana.publicKey);
    expect(transter.destination).toBe(
      'Cn9yzV2kdCQRYNUYZ4KXeD5Z7DmevUkqixjv8eaYYXfk'
    );
    expect(transter.amount).toBe('1000000');
  });

  test('decode PUMP Transfer Transaction', async () => {
    const connection = new solana.Connection(RPC_URL.SOLANA_MAIN);
    const transaction = await Transaction.solana.create(connection, {
      feePayer: 'Cn9yzV2kdCQRYNUYZ4KXeD5Z7DmevUkqixjv8eaYYXfk',
      source: 'Cn9yzV2kdCQRYNUYZ4KXeD5Z7DmevUkqixjv8eaYYXfk',
      destination: '5g1QJWjSKuP2Pd2hbRffiSKPt7qgNvHgSN3m7nzRNbBM',
      amount: '1000000',
      mint: 'pumpCmXqMfrsAkQ5r49WcJnRayYRqmXz6ae8H7H9Dfn',
      tokenProgram: TOKEN_2022_PROGRAM_ID,
    });

    const latestBlockhash = await connection.getLatestBlockhash();
    transaction.feePayer = new solana.PublicKey(wallet.solana.publicKey);
    transaction.recentBlockhash = latestBlockhash.blockhash;
    transaction.lastValidBlockHeight = latestBlockhash.lastValidBlockHeight;

    const serialized = transaction
      .serialize({ requireAllSignatures: false })
      .toString('base64');

    const transter = await Transaction.solana.decodeTransfer(
      connection,
      serialized
    );

    expect(transter.source).toBe(
      'Cn9yzV2kdCQRYNUYZ4KXeD5Z7DmevUkqixjv8eaYYXfk'
    );
    expect(transter.destination).toBe(
      '5g1QJWjSKuP2Pd2hbRffiSKPt7qgNvHgSN3m7nzRNbBM'
    );
    expect(transter.amount).toBe('1000000');
  });

  test('get Solana Transfers', async () => {
    const connection = new solana.Connection(RPC_URL.SOLANA_MAIN);
    const transfers = await Transaction.solana.getTransfers(
      connection,
      '2Xw7wah1migKkQ5VS6fizvStFd3E8sedtUfr6tGDXc6AZaAjXQZseZDC5vkKvKYmGDXVfuur7aoDxKXn15vGiRYf'
    );

    expect(transfers).toBeDefined();
    expect(transfers.length).toBe(1);
    expect(transfers[0].source).toBe(
      'Cn9yzV2kdCQRYNUYZ4KXeD5Z7DmevUkqixjv8eaYYXfk'
    );
    expect(transfers[0].destination).toBe(
      '5g1QJWjSKuP2Pd2hbRffiSKPt7qgNvHgSN3m7nzRNbBM'
    );
    expect(transfers[0].amount).toBe('200000');
  });

  test('get Solana Transfer with params', async () => {
    const transfer = await Transaction.getTransfer(
      '2Xw7wah1migKkQ5VS6fizvStFd3E8sedtUfr6tGDXc6AZaAjXQZseZDC5vkKvKYmGDXVfuur7aoDxKXn15vGiRYf',
      {
        network: NETWORKS.SOLANA,
        rpcUrl: RPC_URL.SOLANA_MAIN,
        source: 'Cn9yzV2kdCQRYNUYZ4KXeD5Z7DmevUkqixjv8eaYYXfk',
        destination: '5g1QJWjSKuP2Pd2hbRffiSKPt7qgNvHgSN3m7nzRNbBM',
      }
    );

    expect(transfer).toBeDefined();
    expect(transfer.source).toBe(
      'Cn9yzV2kdCQRYNUYZ4KXeD5Z7DmevUkqixjv8eaYYXfk'
    );
    expect(transfer.destination).toBe(
      '5g1QJWjSKuP2Pd2hbRffiSKPt7qgNvHgSN3m7nzRNbBM'
    );
    expect(transfer.amount).toBe('200000');
  });

  test('get EVM Transfer with params', async () => {
    const transfer = await Transaction.getTransfer(
      '0xc5bfb0ac331e117206d7a523e0e2915601f18761d6717f5e0a451bad406d12aa',
      {
        network: NETWORKS.BSC,
        rpcUrl: RPC_URL.BSC,
        source: '0x6d5e3A9a24171b206a781707Fe90B565e67dCD6C',
        destination: '0x723324C6EB42a8D417d43699D93Ad0Df6DE2479B',
      }
    );

    expect(transfer).toBeDefined();
    expect(transfer.source).toBe('0x6d5e3A9a24171b206a781707Fe90B565e67dCD6C');
    expect(transfer.destination).toBe(
      '0x723324C6EB42a8D417d43699D93Ad0Df6DE2479B'
    );
    expect(transfer.amount).toBe('1000000000000');
  });

  test('get Solana Gas Fee', async () => {
    const connection = new solana.Connection(RPC_URL.SOLANA_DEV);
    const transaction = await Transaction.solana.get(connection, {
      signature:
        '295q29VLXDbL4TkvNmxSqfX6i1B1nQhXu4U9ZZc2xkFp5U1cniPmGDfugaMNpGMyJPk4fPGd7e9PJZjpJU8KjK6K',
    });
    const gasFee = Transaction.getGasFee(transaction, {
      network: NETWORKS.SOLANA,
    });
    expect(BigInt(gasFee)).toBeGreaterThan(0n);
  });

  test('get EVM Gas Fee', async () => {
    const provider = new ethers.JsonRpcProvider(RPC_URL.BSC);
    const receipt = await Transaction.evm.getReceipt(
      provider,
      '0xc5bfb0ac331e117206d7a523e0e2915601f18761d6717f5e0a451bad406d12aa'
    );
    const gasFee = Transaction.getGasFee(receipt, {
      network: NETWORKS.BSC,
    });
    expect(BigInt(gasFee)).toBeGreaterThan(0n);
  });

  test('get Solana Transaction Block Time', async () => {
    const connection = new solana.Connection(RPC_URL.SOLANA_DEV);
    const transaction = await Transaction.solana.get(connection, {
      signature:
        '295q29VLXDbL4TkvNmxSqfX6i1B1nQhXu4U9ZZc2xkFp5U1cniPmGDfugaMNpGMyJPk4fPGd7e9PJZjpJU8KjK6K',
    });

    const blockTime = await Transaction.getBlockTime(transaction, {
      network: NETWORKS.SOLANA,
      rpcUrl: RPC_URL.SOLANA_DEV,
    });
    expect(blockTime).toBeGreaterThan(0);
  });

  test('get EVM Transaction Block Time', async () => {
    const provider = new ethers.JsonRpcProvider(RPC_URL.BSC);
    const receipt = await Transaction.evm.getReceipt(
      provider,
      '0xc5bfb0ac331e117206d7a523e0e2915601f18761d6717f5e0a451bad406d12aa'
    );
    const blockTime = await Transaction.getBlockTime(receipt, {
      network: NETWORKS.BSC,
      rpcUrl: RPC_URL.BSC,
    });
    expect(blockTime).toBeGreaterThan(0);
  });

  test('estimate EVM Gas Fee', async () => {
    const provider = new ethers.JsonRpcProvider(RPC_URL.BSC);
    const gasPrice = await Transaction.evm.estimateFee(provider);
    expect(BigInt(gasPrice)).toBeGreaterThan(0n);
  });

  test('estimate EVM Gas Fee with params', async () => {
    const keyVaultService = new KeyVaultService(crypto.randomBytes(32));
    const wallet = keyVaultService.evm.recover(
      keyVaultService.evm.generate().privateKeyEncrypted
    );
    const provider = new ethers.JsonRpcProvider(RPC_URL.BSC);
    const signer = new ethers.Wallet(wallet.privateKey, provider);

    const gasPrice = await Transaction.evm.estimateFee(provider, {
      tokenAddress: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
      signer,
      destination: '0x6d5e3A9a24171b206a781707Fe90B565e67dCD6C',
      amount: '0',
    });
    expect(BigInt(gasPrice)).toBeGreaterThan(0n);
  });
});
