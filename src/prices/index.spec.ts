import { test, expect, describe } from 'bun:test';
import { prices } from '.';
import { NETWORKS } from '../constants';

describe('getPrice', () => {
  test('get Solana Price', async () => {
    const price = await prices.fetch({ network: NETWORKS.SOLANA });
    expect(price).toBeDefined();
  });

  test('get BSC Price', async () => {
    const price = await prices.fetch({ network: NETWORKS.BSC });
    expect(price).toBeDefined();
  });

  test('get ETHEREUM Price', async () => {
    const price = await prices.fetch({ network: NETWORKS.ETHEREUM });
    expect(price).toBeDefined();
  });

  test('get TON Price', async () => {
    const price = await prices.fetch({ network: NETWORKS.TON });
    expect(price).toBeDefined();
  });

  test('get Solana token price(PUMP)', async () => {
    const price = await prices.fetch({ network: NETWORKS.SOLANA, tokenAddress: 'pumpCmXqMfrsAkQ5r49WcJnRayYRqmXz6ae8H7H9Dfn' });
    expect(price).toBeDefined();
  });

  test('get Solana token price(JUP)', async () => {
    const price = await prices.fetch({ network: NETWORKS.SOLANA, tokenAddress: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN' });
    expect(price).toBeDefined();
  });

  test('get BSC token price(USDT)', async () => {
    const price = await prices.fetch({ network: NETWORKS.BSC, tokenAddress: '0x55d398326f99059fF775485246999027B3197955' });
    expect(price).toBeDefined();
  });

  test('get ETHEREUM token price(USDT)', async () => {
    const price = await prices.fetch({ network: NETWORKS.ETHEREUM, tokenAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7' });
    expect(price).toBeDefined();
  });

  test('get TON token price(Dogs)', async () => {
    const price = await prices.fetch({ network: NETWORKS.TON, tokenAddress: 'EQCvxJy4eG8hyHBFsZ7eePxrRsUQSFE_jpptRAYBmcG_DOGS' });
    expect(price).toBeDefined();
  });
});

