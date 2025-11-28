import { test, expect, describe } from 'bun:test';
import { Connection } from '@solana/web3.js';
import { JsonRpcProvider } from 'ethers';
import { NETWORKS, RPC_URL } from '../constants';
import { getGasFee } from '.';

describe('getGasFee', () => {
  test('get Solana Gas Fee', async () => {
    const connection = new Connection(RPC_URL.SOLANA_DEV);

    const transaction = await connection.getParsedTransaction(
      '295q29VLXDbL4TkvNmxSqfX6i1B1nQhXu4U9ZZc2xkFp5U1cniPmGDfugaMNpGMyJPk4fPGd7e9PJZjpJU8KjK6K',
      {
        maxSupportedTransactionVersion: 0,
        commitment: 'finalized',
      }
    );

    const gasFee = await getGasFee({ network: NETWORKS.SOLANA })(transaction);
    expect(BigInt(gasFee)).toBeGreaterThan(0n);
  });

  test('get BSC Gas Fee', async () => {
    const provider = new JsonRpcProvider(RPC_URL.BSC);
    const receipt = await provider.getTransactionReceipt(
      '0xc5bfb0ac331e117206d7a523e0e2915601f18761d6717f5e0a451bad406d12aa'
    );
    const gasFee = await getGasFee({ network: NETWORKS.BSC })(receipt);
    expect(BigInt(gasFee)).toBeGreaterThan(0n);
  });
});
