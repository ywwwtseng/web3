import { test, expect, describe } from 'bun:test';
import { Connection } from '@solana/web3.js';
import { JsonRpcProvider } from 'ethers';
import { NETWORKS, RPC_URL } from '../constants';
import { getBlockTime } from '.';

describe('Transaction', () => {
  test('get Solana Transaction Block Time', async () => {
    const connection = new Connection(RPC_URL.SOLANA_DEV);

    const transaction = await connection.getParsedTransaction(
      '295q29VLXDbL4TkvNmxSqfX6i1B1nQhXu4U9ZZc2xkFp5U1cniPmGDfugaMNpGMyJPk4fPGd7e9PJZjpJU8KjK6K',
      {
        maxSupportedTransactionVersion: 0,
        commitment: 'finalized',
      }
    );

    const blockTime = await getBlockTime({
      network: NETWORKS.SOLANA,
      transaction,
    });

    expect(blockTime).toBeGreaterThan(0);
  });

  test('get EVM Transaction Block Time', async () => {
    const provider = new JsonRpcProvider(RPC_URL.BSC);
    const transaction = await provider.getTransactionReceipt(
      '0xc5bfb0ac331e117206d7a523e0e2915601f18761d6717f5e0a451bad406d12aa'
    );
    const blockTime = await getBlockTime({
      network: NETWORKS.BSC,
      provider,
      transaction,
    });
    expect(blockTime).toBeGreaterThan(0);
  });
});
