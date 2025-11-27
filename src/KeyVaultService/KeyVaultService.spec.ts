import { test, expect, describe } from 'bun:test';
import crypto from 'crypto';
import { KeyVaultService } from '..';

describe('KeyVaultService', () => {
  test('solana generate and recover wallet', () => {
    const keyVaultService = new KeyVaultService(crypto.randomBytes(32));
    const wallet = keyVaultService.solana.generate();
    const recovered = keyVaultService.solana.recover(
      wallet.privateKeyEncrypted
    );

    expect(wallet.publicKey.toBase58()).toBe(recovered.publicKey.toBase58());

    expect(keyVaultService.decrypt(wallet.privateKeyEncrypted)).toBe(
      Buffer.from(recovered.secretKey).toString('hex')
    );
  });

  test('evm generate and recover wallet', () => {
    const keyVaultService = new KeyVaultService(crypto.randomBytes(32));
    const wallet = keyVaultService.evm.generate();
    const recovered = keyVaultService.evm.recover(wallet.privateKeyEncrypted);

    expect(wallet.address).toBe(recovered.address);

    expect(keyVaultService.decrypt(wallet.privateKeyEncrypted)).toBe(
      recovered.privateKey
    );
  });

  test('ton generate and recover wallet', async () => {
    const keyVaultService = new KeyVaultService(crypto.randomBytes(32));
    const wallet = await keyVaultService.ton.generate();
    const recovered = keyVaultService.ton.recover(wallet.privateKeyEncrypted);

    // 地址存在但合約尚未部署，使用 non-bounceable UQ...，才能保證能接收 TON 不會 bounced 回去
    expect(wallet.address.toString({ urlSafe: true, bounceable: false })).toBe(
      recovered.address.toString({ urlSafe: true, bounceable: false })
    );
    expect(keyVaultService.decrypt(wallet.privateKeyEncrypted)).toBe(
      recovered.privateKey
    );
  });
});
