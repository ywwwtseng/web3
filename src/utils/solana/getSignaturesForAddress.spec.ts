import { test, expect } from 'bun:test';
import { Connection } from '@solana/web3.js';
import { getSignaturesForAddress } from './getSignaturesForAddress';
import { RPC_URL } from '../../constants';

test('getSignaturesForAddress', async () => {
  const connection = new Connection(RPC_URL.SOLANA_DEV);

  const signatures = await getSignaturesForAddress(connection, {
    address: 'HSb2Krq5gAD8syfgwikbiF4iJzVXwxU41p6By34Zh5nK',
  });

  expect(signatures).toBeDefined();
  expect(signatures.length).toBeGreaterThan(0);
});
