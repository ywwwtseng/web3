import { test, expect, describe } from 'bun:test';
import { Transaction, solana, ethers, RPC_URL } from '..';
import { wallet } from '../config/wallet';

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
    const provider = new ethers.JsonRpcProvider(RPC_URL.BINANCE);
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

  test('get EVM Transfer', async () => {
    const provider = new ethers.JsonRpcProvider(RPC_URL.BINANCE);

    const transfer = await Transaction.evm.getTransfer(
      provider,
      '0xc5bfb0ac331e117206d7a523e0e2915601f18761d6717f5e0a451bad406d12aa'
    );

    expect(transfer).toBeDefined();
    expect(transfer.source).toBe('0x6d5e3A9a24171b206a781707Fe90B565e67dCD6C');
    expect(transfer.destination).toBe(
      '0x723324C6EB42a8D417d43699D93Ad0Df6DE2479B'
    );
    expect(transfer.amount).toBe('1000000000000');
  });

  test('get Solana Transfer with params', async () => {
    const transfer = await Transaction.getTransfer(
      '2Xw7wah1migKkQ5VS6fizvStFd3E8sedtUfr6tGDXc6AZaAjXQZseZDC5vkKvKYmGDXVfuur7aoDxKXn15vGiRYf',
      {
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
        rpcUrl: RPC_URL.BINANCE,
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
    const gasFee = Transaction.getGasFee(transaction);
    expect(gasFee).toBeGreaterThan(0);
  });

  test('get EVM Gas Fee', async () => {
    const provider = new ethers.JsonRpcProvider(RPC_URL.BINANCE);
    const receipt = await Transaction.evm.getReceipt(
      provider,
      '0xc5bfb0ac331e117206d7a523e0e2915601f18761d6717f5e0a451bad406d12aa'
    );
    const gasFee = Transaction.getGasFee(receipt);
    expect(gasFee).toBeGreaterThan(0);
  });

  test('get Solana Transaction Block Time', async () => {
    const connection = new solana.Connection(RPC_URL.SOLANA_DEV);
    const transaction = await Transaction.solana.get(connection, {
      signature:
        '295q29VLXDbL4TkvNmxSqfX6i1B1nQhXu4U9ZZc2xkFp5U1cniPmGDfugaMNpGMyJPk4fPGd7e9PJZjpJU8KjK6K',
    });

    const blockTime = await Transaction.getBlockTime(
      transaction,
      RPC_URL.SOLANA_DEV
    );
    expect(blockTime).toBeGreaterThan(0);
  });

  test('get EVM Transaction Block Time', async () => {
    const provider = new ethers.JsonRpcProvider(RPC_URL.BINANCE);
    const receipt = await Transaction.evm.getReceipt(
      provider,
      '0xc5bfb0ac331e117206d7a523e0e2915601f18761d6717f5e0a451bad406d12aa'
    );
    const blockTime = await Transaction.getBlockTime(receipt, RPC_URL.BINANCE);
    expect(blockTime).toBeGreaterThan(0);
  });
});
