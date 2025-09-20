import { test, expect, describe } from 'bun:test';
import { Balance } from './Balance';
import { wallet } from '../config/wallet';
import { RPC_URL } from '../constants';
import { solana, ethers } from '..';

describe('Balance', () => {
  test('Solana Network Balance get SOL balance', async () => {
    const connection = new solana.Connection(RPC_URL.SOLANA_DEV);
    const balance = await Balance.solana.get(connection, {
      address: wallet.solana.publicKey,
    });

    expect(balance).toBeGreaterThan(0);
  });

  test('Solana Network Balance get USDC balance', async () => {
    // https://faucet.circle.com/
    const connection = new solana.Connection(RPC_URL.SOLANA_DEV);
    const balance = await Balance.solana.get(connection, {
      address: wallet.solana.publicKey,
      tokenAddress: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
    });

    expect(balance).toBeGreaterThan(0);
  });

  test('BSC Network Balance get BNB balance', async () => {
    const provider = new ethers.JsonRpcProvider(RPC_URL.BINANCE);
    const balance = await Balance.evm.get(provider, {
      address: '0x6d5e3A9a24171b206a781707Fe90B565e67dCD6C',
    });

    expect(typeof balance).toBe('bigint');
  });

  test('BSC Network Balance get USDC balance', async () => {
    const provider = new ethers.JsonRpcProvider(RPC_URL.BINANCE);
    const balance = await Balance.evm.get(provider, {
      address: '0x6d5e3A9a24171b206a781707Fe90B565e67dCD6C',
      tokenAddress: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
    });

    expect(typeof balance).toBe('bigint');
  });
});
