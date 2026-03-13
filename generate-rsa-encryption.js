const forge = require("node-forge");

// Key Generation (same as Digital Signature)
const keypair = forge.pki.rsa.generateKeyPair({ bits: 2048, e: 0x10001 });
const publicKeyPem = forge.pki.publicKeyToPem(keypair.publicKey);
const privateKeyPem = forge.pki.privateKeyToPem(keypair.privateKey);

console.log("Public Key:");
console.log(publicKeyPem);

// Sender Encrypts Message using RECIPIENT's public key
const message = "this is a secret message";
console.log("Original Message:", message);

const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
const encrypted = publicKey.encrypt(message, "RSA-OAEP");
const encryptedHex = forge.util.bytesToHex(encrypted);

console.log("Encrypted (hex):", encryptedHex);

/**
 * After this, SENDER sends ENCRYPTED MESSAGE to RECIPIENT
 * Only the RECIPIENT (with private key) can decrypt it
 */
