import { test, expect, describe } from 'bun:test';
import { TonClient } from '@ton/ton';
import { getTransaction } from './getTransaction';
import { getTxHash } from './getTxHash';

describe('getTransaction', () => {
  test('estimate EVM Transfer Native Token Gas Fee', async () => {
    const client = new TonClient({
      endpoint: 'https://toncenter.com/api/v2/jsonRPC',
      apiKey: process.env.TONCENTER_API_KEY,
    });
    const transaction = await getTransaction({
      txHash: getTxHash(
        'te6cckEBBAEAtwAB5YgAY6lN36SYpW3Sr837ycV9bCcgxbta35yKZ8skESIMEGgDm0s7c///+ItJU6gQAAABHMo904iLEVc9gZGBX7SwY+t62CXgbpUCsT32rqEqkYbKNPxawtOIEFJhyNJym68DdqLyolpmE31kRm2uegnFKAkBAgoOw8htAwIDAAAAaEIASBQKww91mpe54qVTU/7RG5n/DzrqZ1VT6XoB7/FfVcMgL68IAAAAAAAAAAAAAAAAAACWoVBb'
      ),
      address: 'UQAx1Kbv0kxStulX5v3k4r62E5Bi3a1vzkUz5ZIIkQYINAv7',
      client,
    });

    console.log(transaction);
  });
});
