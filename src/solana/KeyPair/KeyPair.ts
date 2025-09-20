import { Keypair } from '@solana/web3.js';

export class KeyPair {
  public static from(secretKey: string | Uint8Array): Keypair {
    return Keypair.fromSecretKey(
      secretKey instanceof Uint8Array
        ? secretKey
        : Uint8Array.from(Buffer.from(secretKey, 'hex'))
    );
  }

  public static generate() {
    return Keypair.generate();
  }
}
