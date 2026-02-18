import { test, expect, describe } from 'bun:test';
import { JsonRpcProvider } from 'ethers';
import { getConfirmations } from './getConfirmations';
import { RPC_URL } from '../../constants';

const BSC_TX_HASH =
  '0xc5bfb0ac331e117206d7a523e0e2915601f18761d6717f5e0a451bad406d12aa';

describe('getConfirmations', () => {
  test('getConfirmations', async () => {
    const provider = new JsonRpcProvider(RPC_URL.BSC);
    const confirmations = await getConfirmations({
      provider,
      hash: BSC_TX_HASH,
    });

    expect(typeof confirmations).toBe('number');
    expect(confirmations).toBeGreaterThanOrEqual(0);
  });
});
