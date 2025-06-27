import * as crypto from 'crypto';

const algorithm = 'aes-256-cbc';
const secretKey = process.env.JWT_ENCRYPTION_SECRET || 'defaultkeydefaultkeydefaultkey12'; // 32 bytes

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function decrypt(text: string): string {
  const [ivText, encryptedText] = text.split(':');
  const iv = Buffer.from(ivText, 'hex');
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(secretKey),
    iv
  );
  let decrypted = decipher.update(Buffer.from(encryptedText, 'hex'));
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
