const { io } = require("socket.io-client");
const readline = require("readline");
const crypto = require("crypto");
const forge = require("node-forge");

const socket = io("http://localhost:3000");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Key generation for digital signature and encryption
const keypair = forge.pki.rsa.generateKeyPair({ bits: 2048, e: 0x10001 });
const publicKey = forge.pki.publicKeyToPem(keypair.publicKey);
const privateKey = keypair.privateKey;

let registeredUsernames = {};
let username = "";
let targetUsername = "";

socket.on("connect", () => {
  console.log("Connected to the server!");

  rl.question("Enter your username: ", (input) => {
    username = input;
    socket.emit("registerPublicKey", { username, publicKey });
    rl.prompt();
  });
});

// Receive and store public keys from all users
socket.on("publicKeyRegistry", (data) => {
  registeredUsernames = data;
});

rl.on("line", (input) => {
  if (!username) return;

  const trimmed = input.trim();

  // /SECRET <targetUsername> <message>
  if (trimmed.startsWith("/SECRET")) {
    const parts = trimmed.split(" ");
    const target = parts[1];
    const secretMessage = parts.slice(2).join(" ");

    if (!secretMessage) {
      console.log("Usage: /SECRET <username> <message>");
      rl.prompt();
      return;
    }

    targetUsername = target;

    if (!registeredUsernames[target]) {
      console.log(`User "${target}" not found in the chat`);
      rl.prompt();
      return;
    }

    // Encrypt message with target's public key
    const targetPublicKey = forge.pki.publicKeyFromPem(registeredUsernames[target]);
    const encrypted = targetPublicKey.encrypt(secretMessage, "RSA-OAEP");
    const encryptedHex = forge.util.bytesToHex(encrypted);

    // Sign the encrypted message
    const md = forge.md.sha256.create();
    md.update(encryptedHex, "utf8");
    const signature = forge.util.bytesToHex(privateKey.sign(md));

    // Hash for integrity
    const hash = crypto.createHash("sha256").update(encryptedHex).digest("hex");

    socket.emit("message", {
      username,
      message: encryptedHex,
      signature,
      senderPublicKey: publicKey,
      hash,
      isSecret: true,
      targetUsername: target,
    });
  } else {
    // Normal message with hash + signature
    const hash = crypto.createHash("sha256").update(trimmed).digest("hex");

    const md = forge.md.sha256.create();
    md.update(trimmed, "utf8");
    const signature = forge.util.bytesToHex(privateKey.sign(md));

    socket.emit("message", {
      username,
      message: trimmed,
      signature,
      senderPublicKey: publicKey,
      hash,
      isSecret: false,
    });
  }

  rl.prompt();
});

socket.on("message", (data) => {
  const { username: sender, message, signature, senderPublicKey, hash, isSecret, targetUsername: target } = data;

  if (isSecret) {
    // Only the target can decrypt
    if (target === username) {
      try {
        const encryptedBytes = forge.util.hexToBytes(message);
        const decrypted = keypair.privateKey.decrypt(encryptedBytes, "RSA-OAEP");

        // Verify signature
        const senderKey = forge.pki.publicKeyFromPem(senderPublicKey);
        const md = forge.md.sha256.create();
        md.update(message, "utf8");
        const sigBytes = forge.util.hexToBytes(signature);
        const sigValid = senderKey.verify(md.digest().bytes(), sigBytes);

        if (sigValid) {
          console.log(`\n[SECRET from ${sender}]: ${decrypted}`);
        } else {
          console.log(`\n[SECRET from ${sender}]: ${decrypted} ⚠️ WARNING: signature invalid!`);
        }
      } catch (e) {
        console.log(`\n[SECRET from ${sender}]: (could not decrypt)`);
      }
    }
    // Other users silently ignore secret messages
    return;
  }

  // Verify hash integrity
  const recomputedHash = crypto.createHash("sha256").update(message).digest("hex");
  const hashValid = recomputedHash === hash;

  // Verify digital signature
  let sigValid = false;
  try {
    const senderKey = forge.pki.publicKeyFromPem(senderPublicKey);
    const md = forge.md.sha256.create();
    md.update(message, "utf8");
    const sigBytes = forge.util.hexToBytes(signature);
    sigValid = senderKey.verify(md.digest().bytes(), sigBytes);
  } catch (e) {
    sigValid = false;
  }

  if (!hashValid) {
    console.log(`\n[${sender}]: ${message} ⚠️ WARNING: the message may have been changed during transmission`);
  } else if (!sigValid) {
    console.log(`\n[${sender}]: ${message} ⚠️ WARNING: invalid signature, sender identity cannot be verified`);
  } else {
    console.log(`\n[${sender}]: ${message}`);
  }

  rl.prompt();
});

socket.on("disconnect", () => {
  console.log("Server disconnected. Exiting...");
  process.exit(0);
});

rl.on("close", () => {
  socket.disconnect();
  process.exit(0);
});
