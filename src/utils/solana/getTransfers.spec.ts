import { test, expect } from 'bun:test';
import { Connection } from '@solana/web3.js';
import { getTransfers } from './getTransfers';

test('getTransfers', async () => {
  const connection = new Connection(process.env.RPC_SOLANA_URL);

  const transfers = await getTransfers({
    connection,
    hash: '44PGVTp1keuaJWSzrG8TERqiFepTAdadACgKyUphMVhmBhpR684BandUquKA34FNJnFxRFxxhP3EbAmftwnRM6t1',
  });

  console.log(transfers);

  // expect(signatures).toBeDefined();
}, 10000);
