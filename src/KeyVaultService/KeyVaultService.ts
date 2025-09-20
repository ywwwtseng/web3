import { Wallet } from 'ethers';
import { AES256GCM } from '../utils/AES256GCM';
import { KeyPair } from '../solana/KeyPair/KeyPair';

export class KeyVaultService extends AES256GCM {
  get solana() {
    return {
      generate: () => {
        const wallet = KeyPair.generate();
        const hexPrivateKey = Buffer.from(wallet.secretKey).toString('hex');
        const encryptedPrivateKey = this.encrypt(hexPrivateKey);
    
        return {
          publicKey: wallet.publicKey,
          privateKeyEncrypted: encryptedPrivateKey,
        };
      },
      recover: (encryptedPrivateKey: string) => {
        const decryptedHex = this.decrypt(encryptedPrivateKey);
        return KeyPair.from(decryptedHex);
      },
    };
  }

  get evm() {
    return {
      generate: () => {
        const wallet = Wallet.createRandom();
        const encryptedPrivateKey = this.encrypt(wallet.privateKey);

        return {
          address: wallet.address,
          publicKey: wallet.publicKey,
          privateKeyEncrypted: encryptedPrivateKey,
        };
      },
      recover: (encryptedPrivateKey: string) => {
        const decryptedHex = this.decrypt(encryptedPrivateKey);
        return new Wallet(decryptedHex);
      },
    };
  }
}
