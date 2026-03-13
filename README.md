# AFL-2 Cryptography

A Node.js project implementing hash, digital signature, and encryption algorithms, plus a secure chat application.

## Setup

```bash
pnpm install
```

## Cryptography Experiments

### Hash

```bash
node generate-hash.js   # Generate MD5, SHA1, SHA256 hashes
node verify-hash.js     # Verify hash integrity
```

### Digital Signature

```bash
node generate-signature.js  # Generate RSA keypair and sign a message
node verify-signature.js    # Verify a digital signature
```

### Encryption

```bash
node generate-aes.js          # AES-256 key generation and encryption
node decrypt-aes.js           # AES-256 decryption
node generate-rsa-encryption.js  # RSA encryption
node decrypt-rsa.js           # RSA decryption
```

## Chat Application

### Start normal server

```bash
node server.js
```

### Start malicious server (appends "(sus?)" to messages)

```bash
node malicious-server.js
```

### Start client (in a separate terminal)

```bash
node client.js
```

### Features

- **Hash integrity check**: detects if message was tampered with during transmission
- **Digital signature**: verifies sender identity
- **Secret messages**: use `/SECRET <username> <message>` to send RSA-encrypted messages only the target can read
