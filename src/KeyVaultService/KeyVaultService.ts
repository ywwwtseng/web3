import { Wallet } from 'ethers';
import { mnemonicNew, mnemonicToWalletKey } from '@ton/crypto';
import { WalletContractV5R1 } from '@ton/ton';
import TonWeb from 'tonweb';
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
          address: wallet.publicKey.toString(),
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

  get ton() {
    return {
      generate: async () => {
        const mnemonic = await mnemonicNew(24);
        const keyPair = await mnemonicToWalletKey(mnemonic);
        const hexPrivateKey = Buffer.from(keyPair.secretKey).toString('hex');
        const encryptedPrivateKey = this.encrypt(hexPrivateKey);

        const wallet = WalletContractV5R1.create({
          workchain: 0,
          publicKey: keyPair.publicKey,
        });

        return {
          address: wallet.address,
          publicKey: keyPair.publicKey,
          privateKeyEncrypted: encryptedPrivateKey,
        };
      },
      recover: (encryptedPrivateKey: string) => {
        const decryptedHex = this.decrypt(encryptedPrivateKey);

        const keyPair = TonWeb.utils.nacl.sign.keyPair.fromSecretKey(
          Buffer.from(decryptedHex, 'hex')
        );

        const publicKey = Buffer.from(keyPair.publicKey);

        const wallet = WalletContractV5R1.create({
          workchain: 0,
          publicKey,
        });

        return {
          address: wallet.address,
          publicKey,
          privateKey: decryptedHex,
        };
      },
    };
  }
}
