
import crypto from 'crypto';

export class AES256GCM {
  private key: string;

  constructor(key: string | Buffer) {
    key = typeof key === 'string' ? key : key.toString('hex')

    if (key.length !== 64) {
      throw new Error('Encryption key must be 64 characters long');
    }

    this.key = key;
  }

  encrypt(hexPrivateKey: string) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
      'aes-256-gcm',
      Buffer.from(this.key, 'hex'),
      iv.toString('hex')
    );
    let encrypted = cipher.update(hexPrivateKey, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const tag = cipher.getAuthTag().toString('hex');
    return `${iv.toString('hex')}:${encrypted}:${tag}`;
  }

  decrypt(encrypted: string) {
    const [ivHex, encryptedHex, tagHex] = encrypted.split(':');

    const decipher = crypto.createDecipheriv(
      'aes-256-gcm',
      Buffer.from(this.key, 'hex'),
      ivHex
    );
    decipher.setAuthTag(new Uint8Array(Buffer.from(tagHex, 'hex')));
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}
