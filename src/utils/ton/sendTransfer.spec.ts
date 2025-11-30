import { test, expect, describe } from 'bun:test';
import { TonClient } from '@ton/ton';
import { sha256 } from '@ton/crypto';
import { sendTransfer } from './sendTransfer';

describe('sendTransfer', () => {
  test('send Jetton Transfer', async () => {
    const client = new TonClient({
      endpoint: 'https://toncenter.com/api/v2/jsonRPC',
      apiKey: process.env.TONCENTER_API_KEY,
    });
    const txHash = await sendTransfer({
      client,
      privateKey:
        '85d8f7981c3ce10bbc114e552638f1e3d536224cd18822e334e2ab5eaef642581b3a5f183287f20cf9ecd67f3c5c0544352505651d1a67aeb8d25cd59ed1f0c4',
      destination: 'EQAx1Kbv0kxStulX5v3k4r62E5Bi3a1vzkUz5ZIIkQYINFY-',
      amount: '1000',
      minterAddress: 'EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs',
    });

    console.log(txHash, 'txHash');
  });
});
