import { test, expect, describe } from 'bun:test';
import { Token } from './Token';
import { RPC_URL, NETWORKS } from '../constants';

describe('Token', () => {
  test('Solana Network get USDC token info', async () => {
    const token = await Token.getInfo({
      address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
      network: NETWORKS.SOLANA,
      rpcUrl: RPC_URL.SOLANA_MAIN,
    });
    expect(token).toBeDefined();
    expect(token.address).toBe('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
    expect(token.name).toBe('USD Coin');
    expect(token.symbol).toBe('USDC');
    expect(token.decimals).toBe(6);
    expect(token.icon).not.toBeEmpty();
    expect(token.icon_file).not.toBeEmpty();
    expect(token.usdPrice).not.toBeNull();
  });

  test('BSC Network get USDC token info', async () => {
    const token = await Token.getInfo({
      address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
      network: NETWORKS.BSC,
      rpcUrl: RPC_URL.BSC,
    });
    expect(token).toBeDefined();
    expect(token.address).toBe('0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d');
    expect(token.name).toBe('USD Coin');
    expect(token.symbol).toBe('USDC');
    expect(token.decimals).toBe(18);
    expect(token.icon).not.toBeEmpty();
    expect(token.icon_file).not.toBeEmpty();
    expect(token.usdPrice).not.toBeNull();
  });

  test('EVM Network get USDC token info', async () => {
    const token = await Token.getInfo({
      address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      network: NETWORKS.ETHEREUM,
      rpcUrl: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
    });
    expect(token).toBeDefined();
    expect(token.address).toBe('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48');
    expect(token.name).toBe('USD Coin');
    expect(token.symbol).toBe('USDC');
    expect(token.usdPrice).not.toBeNull();
  });
});
