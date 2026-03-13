const forge = require("node-forge");

// Key Generation
const keypair = forge.pki.rsa.generateKeyPair({ bits: 2048, e: 0x10001 });
const publicKey = forge.pki.publicKeyToPem(keypair.publicKey);
const privateKey = forge.pki.privateKeyToPem(keypair.privateKey);

console.log("Public Key:");
console.log(publicKey);
console.log("Private Key:");
console.log(privateKey);

// SENDER generates Digital Signature
const message = "this is a secret message";
const md = forge.md.sha256.create();
md.update(message, "utf8");
const signature = keypair.privateKey.sign(md);
const signatureHex = forge.util.bytesToHex(signature);

console.log("Message:", message);
console.log("Signature (hex):", signatureHex);

/**
 * After this, SENDER sends MESSAGE, SIGNATURE, and PUBLIC KEY to RECIPIENT
 */
