const {
  Document, Packer, Paragraph, TextRun, AlignmentType,
  HeadingLevel, LevelFormat, BorderStyle, PageNumber,
  Header, Footer, ShadingType
} = require("docx");
const fs = require("fs");

// Helper: normal paragraph
function p(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 120 },
    children: [new TextRun({ text, ...opts })],
  });
}

// Helper: bold label paragraph
function label(text) {
  return new Paragraph({
    spacing: { after: 80 },
    children: [new TextRun({ text, bold: true, size: 22 })],
  });
}

// Helper: answer paragraph
function answer(text) {
  return new Paragraph({
    spacing: { after: 160 },
    indent: { left: 360 },
    children: [new TextRun({ text, size: 22 })],
  });
}

// Helper: section heading
function sectionHeading(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 200 },
    children: [new TextRun({ text, bold: true, size: 28 })],
  });
}

// Helper: subsection heading
function subHeading(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 160 },
    children: [new TextRun({ text, bold: true, size: 24 })],
  });
}

// Helper: bullet item
function bullet(text) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { after: 80 },
    children: [new TextRun({ text, size: 22 })],
  });
}

// Helper: code-style paragraph
function code(text) {
  return new Paragraph({
    spacing: { after: 80 },
    indent: { left: 360 },
    children: [new TextRun({ text, font: "Courier New", size: 20 })],
  });
}

function spacer() {
  return new Paragraph({ spacing: { after: 160 }, children: [new TextRun("")] });
}

const doc = new Document({
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: "\u2022",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }],
      },
      {
        reference: "numbers",
        levels: [{
          level: 0, format: LevelFormat.DECIMAL, text: "%1.",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } },
        }],
      },
    ],
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
      },
    },
    children: [
      // ─── COVER PAGE ───
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 1440, after: 480 },
        children: [new TextRun({ text: "AFL-2 Cyber Security", bold: true, size: 48 })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 480 },
        children: [new TextRun({ text: "Kriptografi", bold: true, size: 36 })],
      }),
      spacer(),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 160 },
        children: [new TextRun({ text: "Nama: Ryan Bagus Prihantono", size: 24 })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 160 },
        children: [new TextRun({ text: "NIM: 0706012414001", size: 24 })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 160 },
        children: [new TextRun({ text: "Universitas Ciputra Online Learning", size: 24 })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 160 },
        children: [new TextRun({ text: "Surabaya, 2024", size: 24 })],
      }),

      // PAGE BREAK
      new Paragraph({ pageBreakBefore: true, children: [new TextRun("")] }),

      // ─── SECTION 1: CRYPTOGRAPHY EXERCISE ───
      sectionHeading("#1 Cryptography Exercise (Score 80)"),

      // ── HASH ──
      subHeading("Hash (20)"),

      label("Questions 1.A"),
      label("1. Try to run generate-hash.js multiple times! What happen to the result?"),
      answer(
        "When running generate-hash.js multiple times, the result is always the same. " +
        "The MD5, SHA1, and SHA256 hash values do not change because the input message " +
        '("this is a secret message") is fixed. Hash functions are deterministic — ' +
        "the same input always produces the same output regardless of how many times it is run."
      ),
      p("[Screenshot: generate-hash.js run multiple times showing identical hashes]", { italics: true, color: "888888" }),
      spacer(),

      label("2. Try to change the message into other text, what happen to the result?"),
      answer(
        "When the message is changed (e.g., from \"this is a secret message\" to " +
        '"this is a secret key"), the hash values change completely. Even a small ' +
        "change in the input produces a completely different hash output. " +
        "This property is called the avalanche effect — a tiny change in input " +
        "creates a drastically different hash output, making hash functions reliable " +
        "for detecting any modification to data."
      ),
      p("[Screenshot: generate-hash.js with different message showing different hashes]", { italics: true, color: "888888" }),
      spacer(),

      label("3. What did you learn from this Question 1.A experiment?"),
      answer(
        "From this experiment, I learned that hash functions have two key properties: " +
        "(1) Determinism — the same input always produces the same hash, which allows " +
        "a recipient to verify data integrity by recomputing and comparing hashes; " +
        "(2) Avalanche effect — any change, even a single character, produces a completely " +
        "different hash. This makes hash functions useful for detecting tampering in " +
        "data transmission. MD5 produces a 128-bit hash, SHA1 produces 160-bit, and " +
        "SHA256 produces a 256-bit hash — with SHA256 being the most secure of the three."
      ),
      spacer(),

      label("Questions 2.A"),
      label("1. Try to change the message to 'this is a secret key', what happen to the result?"),
      answer(
        "When the message in verify-hash.js is changed to 'this is a secret key' but " +
        "the senderHash remains the original hash of 'this is a secret message', " +
        "the verification result is false. The recipient computes a new hash from the " +
        "modified message, which does not match the sender's hash, so isValid becomes false. " +
        "This simulates how hash verification detects that the message was tampered with during transmission."
      ),
      p("[Screenshot: verify-hash.js with changed message showing false result]", { italics: true, color: "888888" }),
      spacer(),

      label("2. What did you learn from this Question 2.A experiment?"),
      answer(
        "From this experiment, I learned how hash-based integrity verification works. " +
        "The sender computes a hash of the original message and sends both the message " +
        "and hash to the recipient. The recipient recomputes the hash from the received message " +
        "and compares it with the sender's hash. If they match, the message is intact. " +
        "If they don't match — as when we changed the message — the verification fails, " +
        "revealing that the message was altered. This is the fundamental mechanism used " +
        "in digital communications to ensure data integrity."
      ),
      spacer(),

      // ── DIGITAL SIGNATURE ──
      subHeading("Digital Signature (30)"),

      label("Questions 1.B"),
      label("1. Try to run generate-signature.js multiple times, does the signature look the same?"),
      answer(
        "No, the signature is different every time. Although the message is the same, " +
        "RSA digital signatures use PKCS#1 v1.5 padding which includes random padding bytes, " +
        "so each run produces a different keypair and therefore a different signature. " +
        "However, each signature is still valid for its corresponding keypair. " +
        "If using a fixed keypair, the signature would also be deterministic — " +
        "but since we generate a new keypair each run, the signature changes."
      ),
      p("[Screenshot: generate-signature.js run multiple times showing different signatures]", { italics: true, color: "888888" }),
      spacer(),

      label("2. What did you learn from this Question 1.B experiment?"),
      answer(
        "I learned that digital signatures use asymmetric (public-key) cryptography. " +
        "A private key is used to sign a message, and anyone with the corresponding " +
        "public key can verify the signature. The signature proves both the authenticity " +
        "(who sent it) and integrity (message was not modified) of the data. " +
        "RSA is one of the most widely used asymmetric algorithms, generating a keypair " +
        "where the private key must be kept secret and the public key can be shared freely."
      ),
      spacer(),

      label("Questions 1.C"),
      label("1. Try to modify the message, does the signature verification still work?"),
      answer(
        "No, the signature verification fails when the message is modified. " +
        "The digital signature is computed from the original message digest. " +
        "When the message changes, the digest changes, and the signature no longer " +
        "matches the new digest. The verify() function returns false, indicating " +
        "the message was tampered with after signing. This demonstrates how digital " +
        "signatures protect both integrity and authenticity."
      ),
      p("[Screenshot: verify-signature.js with modified message showing false]", { italics: true, color: "888888" }),
      spacer(),

      label("2. What did you learn from this Question 1.C experiment?"),
      answer(
        "I learned that digital signatures bind the sender's identity to the content " +
        "of the message. Any modification to the message after signing invalidates the " +
        "signature. This makes digital signatures stronger than hash-only verification " +
        "because they also verify who sent the message — an attacker cannot forge a " +
        "valid signature without the sender's private key."
      ),
      spacer(),

      label("Questions 2.B"),
      label("1. Try to impersonate another user, does the client detect it?"),
      answer(
        "Yes, the client detects impersonation. When two clients (ryan and sandy) are " +
        "connected, each client has its own RSA keypair. Messages include the sender's " +
        "public key and signature. If someone tries to send a message claiming to be " +
        "another user, the signature will not match the claimed sender's registered " +
        "public key, and the client displays: " +
        "\"WARNING: invalid signature, sender identity cannot be verified\". " +
        "This prevents impersonation attacks."
      ),
      p("[Screenshot: two clients connected, messages verified with valid signatures]", { italics: true, color: "888888" }),
      spacer(),

      label("2. What did you learn from this Question 2.B experiment?"),
      answer(
        "I learned how digital signatures prevent impersonation in a chat application. " +
        "Each user has a unique private key that only they possess. The server registers " +
        "each user's public key, and every message is signed with the sender's private key. " +
        "Recipients verify the signature using the registered public key. " +
        "Since an attacker does not have the victim's private key, they cannot forge " +
        "a valid signature, making impersonation detectable."
      ),
      spacer(),

      // ── ENCRYPTION ──
      subHeading("Encryption (30)"),

      label("Questions 1.A — AES"),
      label("1. Is the key generation always random? Run generate-aes.js multiple times."),
      answer(
        "Yes, the key and IV are randomly generated each time. Every run of generate-aes.js " +
        "produces a different 256-bit key (hex) and 128-bit IV (hex), and therefore a " +
        "different encrypted ciphertext — even for the same plaintext message. " +
        "This is by design: AES-256-CBC uses a random IV to ensure that encrypting the " +
        "same message twice produces different ciphertext, preventing pattern analysis."
      ),
      p("[Screenshot: generate-aes.js run multiple times showing different keys/IVs]", { italics: true, color: "888888" }),
      spacer(),

      label("2. What did you learn from this Question 1.A experiment?"),
      answer(
        "I learned that AES (Advanced Encryption Standard) is a symmetric encryption algorithm — " +
        "the same key is used for both encryption and decryption. AES-256-CBC uses a 256-bit key " +
        "for strong security and a random Initialization Vector (IV) to ensure each encryption " +
        "is unique. The key challenge with symmetric encryption is securely sharing the key " +
        "with the recipient, which is why asymmetric encryption (RSA) is often combined with " +
        "AES in practice — RSA encrypts the AES key for secure key exchange."
      ),
      spacer(),

      label("Questions 1.B — AES Sender/Recipient"),
      label("1. Run decrypt-aes.js multiple times, does it get the same result?"),
      answer(
        "Yes, decrypt-aes.js always decrypts to the same original message: " +
        "\"this is a secret message\". As long as the correct key and IV are used, " +
        "AES decryption is deterministic and always recovers the original plaintext. " +
        "However, the encrypted ciphertext shown is different each run because a new " +
        "random key and IV are generated each time."
      ),
      p("[Screenshot: decrypt-aes.js output showing 'Decrypted: this is a secret message']", { italics: true, color: "888888" }),
      spacer(),

      label("2. What did you learn from this Question 1.B experiment?"),
      answer(
        "I learned that symmetric encryption is reversible — given the correct key and IV, " +
        "the original plaintext can always be recovered from the ciphertext. " +
        "This makes AES suitable for securing data in transit or at rest. " +
        "The decryption process is the inverse of encryption: the same algorithm with the " +
        "same key and IV reconstructs the original data exactly."
      ),
      spacer(),

      label("Questions 1.C — AES with different message"),
      label("1. Run the ENCRYPT file multiple times, add data to the message object, what happened?"),
      answer(
        "When different messages are encrypted, each produces a completely different " +
        "ciphertext. Longer messages produce longer ciphertext because AES-CBC pads the " +
        "plaintext to block boundaries. The ciphertext bears no visible relationship to " +
        "the plaintext, demonstrating that AES effectively obscures the original data. " +
        "Only someone with the correct key and IV can decrypt it back to the original message."
      ),
      p("[Screenshot: generate-aes.js with different messages showing different ciphertexts]", { italics: true, color: "888888" }),
      spacer(),

      label("Questions 2.A — RSA"),
      label("1. Run the ENCRYPT file multiple times, does it get the same encryption result?"),
      answer(
        "No, RSA encryption with OAEP padding produces a different ciphertext each run, " +
        "even for the same message. This is because RSA-OAEP uses random padding, " +
        "ensuring that the same plaintext encrypts to different ciphertexts each time. " +
        "This property (semantic security) prevents attackers from determining whether " +
        "two ciphertexts correspond to the same plaintext."
      ),
      p("[Screenshot: generate-rsa-encryption.js run multiple times showing different ciphertexts]", { italics: true, color: "888888" }),
      spacer(),

      label("2. Try to make little changes to the message, what happened?"),
      answer(
        "Any change to the message, even a single character, produces a completely " +
        "different ciphertext. This is expected behavior for RSA-OAEP encryption. " +
        "The ciphertext is always 256 bytes (2048-bit key) regardless of message length " +
        "(for short messages). This shows that RSA encryption hides both the content " +
        "and the length/structure of the original message."
      ),
      spacer(),

      label("3. What did you learn from this Question 2.A experiment?"),
      answer(
        "I learned that RSA is an asymmetric encryption algorithm — encryption uses the " +
        "recipient's public key, and only the recipient's private key can decrypt it. " +
        "This solves the key distribution problem of symmetric encryption: the public key " +
        "can be shared openly. However, RSA is much slower than AES and is limited to " +
        "encrypting small data. In practice, RSA is used to encrypt a symmetric key " +
        "(like an AES key), and AES is used to encrypt the actual data."
      ),
      spacer(),

      label("Questions 2.B — RSA Recipient"),
      label("1. Run decrypt-rsa.js, what happen to the result?"),
      answer(
        "The RSA decryption successfully recovers the original plaintext: " +
        "\"this is a secret message\". The recipient uses their private key to decrypt " +
        "the ciphertext produced by the sender using the recipient's public key. " +
        "Only the holder of the private key can decrypt the message, ensuring confidentiality. " +
        "Even though the ciphertext looks different each run, decryption always " +
        "recovers the correct original message."
      ),
      p("[Screenshot: decrypt-rsa.js showing 'Decrypted: this is a secret message']", { italics: true, color: "888888" }),
      spacer(),

      label("2. What did you learn from this Question 2.B experiment?"),
      answer(
        "I learned the complete asymmetric encryption workflow: the sender encrypts with " +
        "the recipient's public key, and only the recipient can decrypt with their private key. " +
        "This ensures end-to-end confidentiality — even if the ciphertext is intercepted, " +
        "it cannot be decrypted without the private key. Combined with digital signatures, " +
        "asymmetric cryptography provides both confidentiality and authentication, " +
        "forming the foundation of secure communications (TLS, PGP, etc.)."
      ),
      spacer(),

      // PAGE BREAK for section 2
      new Paragraph({ pageBreakBefore: true, children: [new TextRun("")] }),

      // ─── SECTION 2: CHAT APPLICATION ───
      sectionHeading("#2 Chat Application Challenge (Score 20)"),
      spacer(),
      new Paragraph({
        spacing: { after: 160 },
        children: [
          new TextRun({ text: "GitHub Repository: ", bold: true, size: 22 }),
          new TextRun({ text: "https://github.com/yujuism/secure-chat-crypto", size: 22 }),
        ],
      }),
      answer(
        "The secure chat application was built in 4 parts following the guide:"
      ),
      bullet("Part 1 (Base): Basic Node.js chat using HTTP + Socket.IO with username registration and message broadcasting"),
      bullet("Part 2 (Hash): malicious-server.js appends '(sus?)' to tamper messages; client detects tampering using SHA-256 hash comparison"),
      bullet("Part 3 (Signature): Each client generates an RSA-2048 keypair on startup; every message is signed with the sender's private key and verified using their public key — impersonation is detected"),
      bullet("Part 4 (Secret): /SECRET <username> <message> command encrypts the message with the target user's RSA public key so only the target can decrypt and read it"),
      spacer(),
      answer(
        "Note: The program will be demonstrated live during the synchronous session."
      ),
    ],
  }],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync("/Users/sanyan/Downloads/AFL-2_Ryan_Bagus_Prihantono.docx", buffer);
  console.log("Done! Saved to /Users/sanyan/Downloads/AFL-2_Ryan_Bagus_Prihantono.docx");
});
