import { test, expect, describe } from 'bun:test';
import { getTransactions } from './getTransactions';
import { NETWORKS } from '../../constants';

describe('getTransactions', () => {
  test('getTransactions', async () => {
    const transactions = await getTransactions({
      network: NETWORKS.BSC,
      noderealApiKey: process.env.NODE_REAL_API_KEY,
      address: '0x723324C6EB42a8D417d43699D93Ad0Df6DE2479B',
      maxCount: 20,
    });

    expect(transactions.transfers.length).toBeGreaterThan(0);
  });
});
