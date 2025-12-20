import { test, expect } from 'bun:test';
import { Connection } from '@solana/web3.js';
import { getSignaturesForAddress } from './getSignaturesForAddress';

test('getSignaturesForAddress', async () => {
  const connection = new Connection(process.env.RPC_SOLANA_URL);

  const signatures = await getSignaturesForAddress(connection, {
    address: 'Cw2tnLijghtGwQTEq2V6KYDPjoyssHL2Ausi4kpHKtZG',
    limit: 20,
  });

  console.log(signatures);

  expect(signatures).toBeDefined();
  expect(signatures.length).toBeGreaterThan(0);
});
