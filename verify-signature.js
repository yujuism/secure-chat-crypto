const forge = require("node-forge");

// Simulate: run generate-signature.js first to get these values
// For demo, we generate a fresh keypair and sign here
const keypair = forge.pki.rsa.generateKeyPair({ bits: 2048, e: 0x10001 });
const publicKeyPem = forge.pki.publicKeyToPem(keypair.publicKey);

const message = "this is a secret message";

// SENDER signs
const md = forge.md.sha256.create();
md.update(message, "utf8");
const signature = keypair.privateKey.sign(md);

// RECIPIENT verifies
const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
const mdVerify = forge.md.sha256.create();
mdVerify.update(message, "utf8");

try {
  const isValid = publicKey.verify(mdVerify.digest().bytes(), signature);
  console.log("Signature verification result:", isValid);
} catch (e) {
  console.log("Signature verification result: false");
}
