const crypto = require("crypto");

/**
 * First of all, the RECIPIENT obtains ENCRYPTED MESSAGE, KEY, and IV
 * from the SENDER
 */

// Run generate-aes.js first and paste the values below
// For demo, we generate and encrypt here then decrypt
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

const message = "this is a secret message";
const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
let encrypted = cipher.update(message, "utf8", "hex");
encrypted += cipher.final("hex");

// RECIPIENT decrypts
const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
let decrypted = decipher.update(encrypted, "hex", "utf8");
decrypted += decipher.final("utf8");

console.log("Encrypted:", encrypted);
console.log("Decrypted:", decrypted);
