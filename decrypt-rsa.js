const forge = require("node-forge");

// For demo: generate keypair, encrypt, then decrypt
const keypair = forge.pki.rsa.generateKeyPair({ bits: 2048, e: 0x10001 });
const publicKeyPem = forge.pki.publicKeyToPem(keypair.publicKey);
const privateKeyPem = forge.pki.privateKeyToPem(keypair.privateKey);

// Sender encrypts
const message = "this is a secret message";
const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
const encrypted = publicKey.encrypt(message, "RSA-OAEP");
const encryptedHex = forge.util.bytesToHex(encrypted);
console.log("Encrypted (hex):", encryptedHex);

// RECIPIENT decrypts using private key
const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
const encryptedBytes = forge.util.hexToBytes(encryptedHex);
const decrypted = privateKey.decrypt(encryptedBytes, "RSA-OAEP");

console.log("Decrypted:", decrypted);
