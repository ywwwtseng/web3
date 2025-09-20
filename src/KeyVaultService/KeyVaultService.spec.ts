import { test, expect, describe } from 'bun:test';
import crypto from 'crypto';
import { KeyVaultService } from '..';

describe('KeyVaultService', () => {
  test('solana generate and recover', () => {
    const keyVaultService = new KeyVaultService(crypto.randomBytes(32));

    const wallet = keyVaultService.solana.generate();
    const recovered = keyVaultService.solana.recover(wallet.privateKeyEncrypted);

    expect(wallet.publicKey.toBase58()).toBe(recovered.publicKey.toBase58());

    expect(keyVaultService.decrypt(wallet.privateKeyEncrypted)).toBe(
      Buffer.from(recovered.secretKey).toString('hex')
    );
  });

  test('evm generate and recover', () => {
    const keyVaultService = new KeyVaultService(crypto.randomBytes(32));
    const wallet = keyVaultService.evm.generate();
    const recovered = keyVaultService.evm.recover(wallet.privateKeyEncrypted);

    expect(wallet.address).toBe(recovered.address);

    expect(keyVaultService.decrypt(wallet.privateKeyEncrypted)).toBe(
      recovered.privateKey
    );
  });
});
