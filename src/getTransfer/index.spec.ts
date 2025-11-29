import { test, expect, describe } from 'bun:test';
import { Connection } from '@solana/web3.js';
import { JsonRpcProvider } from 'ethers';
import { TonClient, Address } from '@ton/ton';
import { RPC_URL, NETWORKS } from '../constants';
import { getTxHash } from '../utils/ton/getTxHash';
import { getTransfer } from '.';

describe('getTransfer', () => {
  test('get Solana Transfers', async () => {
    const connection = new Connection(RPC_URL.SOLANA_MAIN);
    // const transfers = await Transaction.solana.getTransfers(
    //   connection,
    //   '2Xw7wah1migKkQ5VS6fizvStFd3E8sedtUfr6tGDXc6AZaAjXQZseZDC5vkKvKYmGDXVfuur7aoDxKXn15vGiRYf'
    // );

    const transfer = await getTransfer({
      network: NETWORKS.SOLANA,
      connection,
      source: 'Cn9yzV2kdCQRYNUYZ4KXeD5Z7DmevUkqixjv8eaYYXfk',
      destination: '5g1QJWjSKuP2Pd2hbRffiSKPt7qgNvHgSN3m7nzRNbBM',
    })(
      '2Xw7wah1migKkQ5VS6fizvStFd3E8sedtUfr6tGDXc6AZaAjXQZseZDC5vkKvKYmGDXVfuur7aoDxKXn15vGiRYf'
    );

    expect(transfer).toBeDefined();
    expect(transfer.source).toBe(
      'Cn9yzV2kdCQRYNUYZ4KXeD5Z7DmevUkqixjv8eaYYXfk'
    );
    expect(transfer.destination).toBe(
      '5g1QJWjSKuP2Pd2hbRffiSKPt7qgNvHgSN3m7nzRNbBM'
    );
    expect(transfer.amount).toBe('200000');
  }, 10000);

  test('get EVM Transfer', async () => {
    const provider = new JsonRpcProvider(RPC_URL.BSC);
    const transfer = await getTransfer({
      network: NETWORKS.BSC,
      provider,
      source: '0x6d5e3A9a24171b206a781707Fe90B565e67dCD6C',
      destination: '0x723324C6EB42a8D417d43699D93Ad0Df6DE2479B',
    })('0xc5bfb0ac331e117206d7a523e0e2915601f18761d6717f5e0a451bad406d12aa');

    expect(transfer).toBeDefined();
    expect(transfer.source).toBe('0x6d5e3A9a24171b206a781707Fe90B565e67dCD6C');
    expect(transfer.destination).toBe(
      '0x723324C6EB42a8D417d43699D93Ad0Df6DE2479B'
    );
    expect(transfer.amount).toBe('1000000000000');
  }, 10000);

  test('get TON Transfer', async () => {
    const client = new TonClient({
      endpoint: 'https://toncenter.com/api/v2/jsonRPC',
      apiKey: process.env.TONCENTER_API_KEY,
    });
    const transfer = await getTransfer({
      network: NETWORKS.TON,
      client,
      source: 'UQAx1Kbv0kxStulX5v3k4r62E5Bi3a1vzkUz5ZIIkQYINAv7',
      destination: 'UQCQKBWGHus1L3PFSqan_aI3M_4eddTOqqfS9APf4r6rhqqO',
    })(
      getTxHash(
        'te6cckEBBAEAtwAB5YgAY6lN36SYpW3Sr837ycV9bCcgxbta35yKZ8skESIMEGgDm0s7c///+ItJU6gQAAABHMo904iLEVc9gZGBX7SwY+t62CXgbpUCsT32rqEqkYbKNPxawtOIEFJhyNJym68DdqLyolpmE31kRm2uegnFKAkBAgoOw8htAwIDAAAAaEIASBQKww91mpe54qVTU/7RG5n/DzrqZ1VT6XoB7/FfVcMgL68IAAAAAAAAAAAAAAAAAACWoVBb'
      )
    );

    expect(transfer).toBeDefined();
    expect(
      Address.parse(transfer.source).toString({
        urlSafe: true,
        bounceable: false,
      })
    ).toBe('UQAx1Kbv0kxStulX5v3k4r62E5Bi3a1vzkUz5ZIIkQYINAv7');
    expect(
      Address.parse(transfer.destination).toString({
        urlSafe: true,
        bounceable: false,
      })
    ).toBe('UQCQKBWGHus1L3PFSqan_aI3M_4eddTOqqfS9APf4r6rhqqO');
    expect(transfer.amount).toBe('100000000');
  });
});
