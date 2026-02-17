import { test, expect, describe } from 'bun:test';
import { getAddress } from '.';
import { NETWORKS } from '../constants';

describe('getAddress', () => {
  test('get BSC network address', async () => {
    const address = getAddress({
      network: NETWORKS.BSC,
      address: '0x6d5e3A9a24171b206a781707Fe90B565e67dCD6C',
    });

    expect(address).toBe('0x6d5e3A9a24171b206a781707Fe90B565e67dCD6C');
  });

  test('get BSC network address throw invalid address', async () => {
    expect(() => getAddress({
      network: NETWORKS.BSC,
      address: 'invalid_address',
    })).toThrow();
  });

  test('get mainnet Ethereum network address', async () => {
    const address = getAddress({
      network: NETWORKS.ETHEREUM,
      address: '0x6d5e3A9a24171b206a781707Fe90B565e67dCD6C',
    });

    expect(address).toBe('0x6d5e3A9a24171b206a781707Fe90B565e67dCD6C');
  });

  test('get mainnet Ethereum network address throw invalid address', async () => {
    expect(() => getAddress({
      network: NETWORKS.ETHEREUM,
      address: 'invalid_address',
    })).toThrow();
  });
  
  test('get TON network address', async () => {
    const address = getAddress({
      network: NETWORKS.TON,
      address: 'UQCQKBWGHus1L3PFSqan_aI3M_4eddTOqqfS9APf4r6rhqqO',
    });

    expect(address).toBe('UQCQKBWGHus1L3PFSqan_aI3M_4eddTOqqfS9APf4r6rhqqO');
  });

  test('get TON network address throw invalid address', async () => {
    expect(() => getAddress({
      network: NETWORKS.TON,
      address: 'invalid_address',
    })).toThrow();
  });

  test('get Solana network address', async () => {
    const address = getAddress({
      network: NETWORKS.SOLANA,
      address: '5g1QJWjSKuP2Pd2hbRffiSKPt7qgNvHgSN3m7nzRNbBM',
    });

    expect(address).toBe('5g1QJWjSKuP2Pd2hbRffiSKPt7qgNvHgSN3m7nzRNbBM');
  });

  test('get Solana network address throw invalid address', async () => {
    expect(() => getAddress({
      network: NETWORKS.SOLANA,
      address: 'invalid_address',
    })).toThrow();
  });
});