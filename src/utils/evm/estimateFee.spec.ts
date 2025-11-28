import { test, expect, describe } from 'bun:test';
import crypto from 'crypto';
import { JsonRpcProvider, Wallet } from 'ethers';
import { estimateFee } from './estimateFee';
import { KeyVaultService } from '../../KeyVaultService';
import { RPC_URL } from '../../constants';

describe('estimateFee', () => {
  test('estimate EVM Transfer Native Token Gas Fee', async () => {
    const provider = new JsonRpcProvider(RPC_URL.BSC);
    const gasPrice = await estimateFee(provider);
    expect(BigInt(gasPrice)).toBeGreaterThan(0n);
  });

  test('estimate EVM Transfer ERC20 Token Gas Fee', async () => {
    const keyVaultService = new KeyVaultService(crypto.randomBytes(32));
    const wallet = keyVaultService.evm.recover(
      keyVaultService.evm.generate().privateKeyEncrypted
    );
    const provider = new JsonRpcProvider(RPC_URL.BSC);
    const signer = new Wallet(wallet.privateKey, provider);

    const gasPrice = await estimateFee({
      provider,
      tokenAddress: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
      signer,
      destination: '0x6d5e3A9a24171b206a781707Fe90B565e67dCD6C',
      amount: '0',
    });
    expect(BigInt(gasPrice)).toBeGreaterThan(0n);
  });
});
