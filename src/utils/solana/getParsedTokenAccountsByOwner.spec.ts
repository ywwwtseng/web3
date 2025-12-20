import { test, expect } from 'bun:test';
import { Connection } from '@solana/web3.js';
import { getParsedTokenAccountsByOwner } from './getParsedTokenAccountsByOwner';
import { RPC_URL } from '../../constants';

test('getParsedTokenAccountsByOwner', async () => {
  const connection = new Connection(RPC_URL.SOLANA_MAIN);

  const atas = await getParsedTokenAccountsByOwner(connection, {
    address: 'Cw2tnLijghtGwQTEq2V6KYDPjoyssHL2Ausi4kpHKtZG',
  });

  console.log(atas);

  expect(atas).toBeDefined();
  expect(atas.length).toBeGreaterThan(0);
});
