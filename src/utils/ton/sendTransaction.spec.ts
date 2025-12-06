import { test, expect, describe } from 'bun:test';
import { TonClient } from '@ton/ton';
import { sendTransaction } from './sendTransaction';

describe('sendTranstaction', () => {
  test('send Transaction', async () => {
    const client = new TonClient({
      endpoint: 'https://toncenter.com/api/v2/jsonRPC',
      apiKey: process.env.TONCENTER_API_KEY,
    });
    const txHash = await sendTransaction({
      client,
      privateKey: process.env.TON_WALLET_PRIVATE_KEY,
      destination: 'EQAx1Kbv0kxStulX5v3k4r62E5Bi3a1vzkUz5ZIIkQYINFY-',
      amount: '500',
      minterAddress: 'EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs',
    });

    expect(txHash).toBeDefined();
  });
});
