// © Copyright 2024 ISTAFFVISION CONSULTING LLP or one of its affiliates.
// This Source is ISTAFFVISION CONSULTING LLP's Copyright and no violation of Copyright is allowed

// iStaffVision Consulting LLP - Paavana est Automation Framework 2024
// File Name : cryptoUtil.js
// Author: Manu.MG
// Date  : 05/26/2024
// Version : 1.0
// Code Description: This code is used to generate an encrypted password and decrypt it.

import crypto from 'crypto';

export class Encrypter {
  constructor(encryptionKey) {
    this.algorithm = "aes-192-cbc";
    this.key = crypto.scryptSync(encryptionKey, "salt", 24);
  }

  encrypt(clearText) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
    const encrypted = cipher.update(clearText, "utf8", "hex");
    return [
      encrypted + cipher.final("hex"),
      Buffer.from(iv).toString("hex"),
    ].join("|");
  }

  dencrypt(encryptedText) {
    const [encrypted, iv] = encryptedText.split("|");
    if (!iv) throw new Error("Password not found"); //IV not found
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      this.key,
      Buffer.from(iv, "hex")
    );
    return decipher.update(encrypted, "hex", "utf8") + decipher.final("utf8");
  }
}