import { test, expect } from 'bun:test';
import { getSignaturesForAddress, solana } from '../..';
import { wallet } from '../../config/wallet';
import { RPC_URL } from '../../constants';

test('getSignaturesForAddress', async () => {
  const connection = new solana.Connection(RPC_URL.SOLANA_DEV);

  const signatures = await getSignaturesForAddress(connection, {
    address: wallet.solana.publicKey,
  });

  expect(signatures).toBeDefined();
  expect(signatures.length).toBeGreaterThan(0);
});
