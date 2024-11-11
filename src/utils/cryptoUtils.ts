import CryptoJS from "crypto-js";

const encryptionKey: string = process.env.ENCRYPTION_KEY || "your_secret_key";

export function encryptData(data: object): string {
  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), encryptionKey);
  return encrypted.toString();
}

export function decryptData(cipherText: string): string {
  const bytes = CryptoJS.AES.decrypt(cipherText, encryptionKey);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);

  if (!decrypted) {
    console.log("Failed to decrypt or data is corrupted");
    // throw new Error("Failed to decrypt or data is corrupted");
  }

  return decrypted;
}
