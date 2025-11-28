import { Connection } from '@solana/web3.js';
import { ethers } from 'ethers';
import { test, expect, describe } from 'bun:test';
import { RPC_URL, NETWORKS } from '../constants';
import { getBalance } from '.';

describe('getBalance', () => {
  test('Solana Network Balance get SOL balance', async () => {
    const connection = new Connection(RPC_URL.SOLANA_DEV);
    const balance = await getBalance({
      network: NETWORKS.SOLANA,
      connection,
    })({
      address: 'HSb2Krq5gAD8syfgwikbiF4iJzVXwxU41p6By34Zh5nK',
    });

    expect(typeof balance).toBe('string');
  });

  test('Solana Network Balance get USDC balance', async () => {
    // https://faucet.circle.com/
    const connection = new Connection(RPC_URL.SOLANA_DEV);
    const balance = await getBalance({
      network: NETWORKS.SOLANA,
      connection,
    })({
      address: 'HSb2Krq5gAD8syfgwikbiF4iJzVXwxU41p6By34Zh5nK',
      tokenAddress: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
    });

    expect(typeof balance).toBe('string');
  });

  test('BSC Network Balance get BNB balance', async () => {
    const provider = new ethers.JsonRpcProvider(RPC_URL.BSC);
    const balance = await getBalance({
      network: NETWORKS.BSC,
      provider,
    })({
      address: '0x6d5e3A9a24171b206a781707Fe90B565e67dCD6C',
    });

    expect(typeof balance).toBe('string');
  });

  test('BSC Network Balance get USDC balance', async () => {
    const provider = new ethers.JsonRpcProvider(RPC_URL.BSC);
    const balance = await getBalance({
      network: NETWORKS.BSC,
      provider,
    })({
      address: '0x6d5e3A9a24171b206a781707Fe90B565e67dCD6C',
      tokenAddress: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
    });

    expect(typeof balance).toBe('string');
  });
});
