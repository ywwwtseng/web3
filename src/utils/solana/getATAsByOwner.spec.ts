import { test, expect } from 'bun:test';
import { Connection } from '@solana/web3.js';
import { getATAsByOwner } from './getATAsByOwner';
import { RPC_URL } from '../../constants';

test('getATAsByOwner', async () => {
  const connection = new Connection(RPC_URL.SOLANA_MAIN);

  const atas = await getATAsByOwner(connection, {
    address: 'Cw2tnLijghtGwQTEq2V6KYDPjoyssHL2Ausi4kpHKtZG',
  });

  expect(atas).toBeDefined();
  expect(atas.length).toBeGreaterThan(0);
});
