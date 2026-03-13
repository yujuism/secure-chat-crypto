# AFL-2 Cyber Security — Kriptografi

**Nama:** Ryan Bagus Prihantono
**NIM:** 0706012414001
**Universitas Ciputra Online Learning, Surabaya, 2024**

---

# #1 Cryptography Exercise (Score 80)

## Hash (20)

### Questions 1.A

**1. Try to run `generate-hash.js` multiple times! What happen to the result?**

When running `generate-hash.js` multiple times, the result is always the same. The MD5, SHA1, and SHA256 hash values do not change because the input message ("this is a secret message") is fixed. Hash functions are deterministic — the same input always produces the same output regardless of how many times it is run.

📸 _Screenshot placeholder: generate-hash.js run multiple times_

---

**2. Try to change the `message` into other text for example `this is a secret key`, what happen to the result?**

When the message is changed, the hash values change completely. Even a small change in the input produces a completely different hash output. This property is called the **avalanche effect** — a tiny change in input creates a drastically different hash output, making hash functions reliable for detecting any modification to data.

📸 _Screenshot placeholder: generate-hash.js with different message showing different hashes_

---

**3. What did you learn from this Question 1.A experiment?**

From this experiment, I learned that hash functions have two key properties:
1. **Determinism** — the same input always produces the same hash, which allows a recipient to verify data integrity by recomputing and comparing hashes.
2. **Avalanche effect** — any change, even a single character, produces a completely different hash. This makes hash functions useful for detecting tampering in data transmission. MD5 produces a 128-bit hash, SHA1 produces 160-bit, and SHA256 produces a 256-bit hash — with SHA256 being the most secure of the three.

---

### Questions 2.A

**1. Try to change the `message` to `this is a secret key`, what happen to the result?**

When the message in `verify-hash.js` is changed to `this is a secret key` but the `senderHash` remains the original hash, the verification result is `false`. The recipient computes a new hash from the modified message, which does not match the sender's hash, so `isValid` becomes `false`. This simulates how hash verification detects that the message was tampered with during transmission.

📸 _Screenshot placeholder: verify-hash.js with changed message showing false_

---

**2. What did you learn from this Question 2.A experiment?**

From this experiment, I learned how hash-based integrity verification works. The sender computes a hash of the original message and sends both the message and hash to the recipient. The recipient recomputes the hash from the received message and compares it with the sender's hash. If they match, the message is intact. If they don't match — as when we changed the message — the verification fails, revealing that the message was altered. This is the fundamental mechanism used in digital communications to ensure data integrity.

---

## Digital Signature (30)

### Questions 1.B

**1. Try to run `generate-signature.js` multiple times, does the signature look the same?**

No, the signature is different every time. Although the message is the same, a new RSA keypair is generated on each run, so the signature changes accordingly. However, each signature is still valid for its corresponding keypair. RSA signatures are deterministic for a fixed key, but since the key changes each run, so does the signature.

📸 _Screenshot placeholder: generate-signature.js run multiple times showing different signatures_

---

**2. What did you learn from this Question 1.B experiment?**

I learned that digital signatures use asymmetric (public-key) cryptography. A private key is used to sign a message, and anyone with the corresponding public key can verify the signature. The signature proves both the **authenticity** (who sent it) and **integrity** (message was not modified) of the data. RSA is one of the most widely used asymmetric algorithms, generating a keypair where the private key must be kept secret and the public key can be shared freely.

---

### Questions 1.C

**1. Try to modify the message, does the signature verification still work?**

No, the signature verification fails when the message is modified. The digital signature is computed from the original message digest. When the message changes, the digest changes, and the signature no longer matches the new digest. The `verify()` function returns `false`, indicating the message was tampered with after signing.

📸 _Screenshot placeholder: verify-signature.js with modified message showing false_

---

**2. What did you learn from this Question 1.C experiment?**

I learned that digital signatures bind the sender's identity to the content of the message. Any modification to the message after signing invalidates the signature. This makes digital signatures stronger than hash-only verification because they also verify **who** sent the message — an attacker cannot forge a valid signature without the sender's private key.

---

### Questions 2.B

**1. Try to impersonate another user, does the client detect it?**

Yes, the client detects impersonation. When two clients (ryan and sandy) are connected, each client has its own RSA keypair. Messages include the sender's public key and signature. If someone tries to send a message claiming to be another user, the signature will not match the claimed sender's registered public key, and the client displays: `⚠️ WARNING: invalid signature, sender identity cannot be verified`.

📸 _Screenshot placeholder: two clients connected — ryan and sandy — with messages verified_

---

**2. What did you learn from this Question 2.B experiment?**

I learned how digital signatures prevent impersonation in a chat application. Each user has a unique private key that only they possess. The server registers each user's public key, and every message is signed with the sender's private key. Recipients verify the signature using the registered public key. Since an attacker does not have the victim's private key, they cannot forge a valid signature, making impersonation detectable.

---

## Encryption (30)

### Questions 1.A — AES Key Generation

**1. Is the key generation always random? Run `generate-aes.js` multiple times.**

Yes, the key and IV are randomly generated each time. Every run produces a different 256-bit key and 128-bit IV, and therefore a different ciphertext — even for the same plaintext. This is by design: AES-256-CBC uses a random IV to ensure encrypting the same message twice produces different ciphertext, preventing pattern analysis.

📸 _Screenshot placeholder: generate-aes.js run multiple times showing different keys/IVs_

---

**2. What did you learn from this Question 1.A experiment?**

I learned that AES (Advanced Encryption Standard) is a symmetric encryption algorithm — the same key is used for both encryption and decryption. AES-256-CBC uses a 256-bit key for strong security and a random Initialization Vector (IV) to ensure each encryption is unique. The key challenge with symmetric encryption is securely sharing the key with the recipient, which is why RSA is often combined with AES in practice.

---

### Questions 1.B — AES Sender/Recipient

**1. Run `decrypt-aes.js` multiple times, does it get the same result?**

Yes, `decrypt-aes.js` always decrypts to the same original message: "this is a secret message". As long as the correct key and IV are used, AES decryption is deterministic and always recovers the original plaintext.

📸 _Screenshot placeholder: decrypt-aes.js output showing 'Decrypted: this is a secret message'_

---

**2. What did you learn from this Question 1.B experiment?**

I learned that symmetric encryption is reversible — given the correct key and IV, the original plaintext can always be recovered from the ciphertext. This makes AES suitable for securing data in transit or at rest. The decryption process is the inverse of encryption: the same algorithm with the same key and IV reconstructs the original data exactly.

---

### Questions 1.C — AES with different message

**1. Run the encrypt file multiple times, add data to the message, what happened?**

When different messages are encrypted, each produces a completely different ciphertext. Longer messages produce longer ciphertext because AES-CBC pads the plaintext to block boundaries. The ciphertext bears no visible relationship to the plaintext, demonstrating that AES effectively obscures the original data.

📸 _Screenshot placeholder: generate-aes.js with different messages_

---

### Questions 2.A — RSA

**1. Run the encrypt file multiple times, does it get the same encryption result?**

No, RSA encryption with OAEP padding produces a different ciphertext each run, even for the same message. This is because RSA-OAEP uses random padding, ensuring that the same plaintext encrypts to different ciphertexts each time. This property (semantic security) prevents attackers from determining whether two ciphertexts correspond to the same plaintext.

📸 _Screenshot placeholder: generate-rsa-encryption.js run multiple times_

---

**2. Try to make little changes to the message, what happened?**

Any change to the message, even a single character, produces a completely different ciphertext. The ciphertext is always 256 bytes (2048-bit key) regardless of message length for short messages.

---

**3. What did you learn from this Question 2.A experiment?**

I learned that RSA is an asymmetric encryption algorithm — encryption uses the recipient's public key, and only the recipient's private key can decrypt it. This solves the key distribution problem of symmetric encryption. However, RSA is much slower than AES and is limited to encrypting small data. In practice, RSA encrypts the AES key, and AES encrypts the actual data.

---

### Questions 2.B — RSA Recipient

**1. Run `decrypt-rsa.js`, what happen to the result?**

The RSA decryption successfully recovers the original plaintext: "this is a secret message". The recipient uses their private key to decrypt the ciphertext produced by the sender using the recipient's public key. Only the holder of the private key can decrypt the message, ensuring confidentiality.

📸 _Screenshot placeholder: decrypt-rsa.js showing 'Decrypted: this is a secret message'_

---

**2. What did you learn from this Question 2.B experiment?**

I learned the complete asymmetric encryption workflow: the sender encrypts with the recipient's public key, and only the recipient can decrypt with their private key. Combined with digital signatures, asymmetric cryptography provides both confidentiality and authentication, forming the foundation of secure communications (TLS, PGP, etc.).

---

# #2 Chat Application Challenge (Score 20)

**GitHub:** https://github.com/yujuism/secure-chat-crypto

> No written report needed — program will be demonstrated during the synchronous session.
