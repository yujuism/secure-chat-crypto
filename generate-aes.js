const crypto = require("crypto");

// Key Generation
const key = crypto.randomBytes(32); // 256-bit key
const iv = crypto.randomBytes(16);  // initialization vector

console.log("Key (hex):", key.toString("hex"));
console.log("IV (hex):", iv.toString("hex"));

// Sender Encrypts Message
const message = "this is a secret message";
console.log("Original Message:", message);

const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
let encrypted = cipher.update(message, "utf8", "hex");
encrypted += cipher.final("hex");

console.log("Encrypted:", encrypted);

/**
 * After this, SENDER sends ENCRYPTED MESSAGE, KEY, and IV to RECIPIENT
 */
